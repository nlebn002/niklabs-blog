# Spec: Media Temp-to-Permanent Move

**Date:** 2026-04-26
**Scope:** Backend only (`backend/`)

---

## Problem

Images uploaded for posts live permanently at `covers/tmp/{yyyy/MM}/{mediaAssetId}-filename` in MinIO even after a post is saved. The `ObjectKey` column in `post.MediaAssets` is never updated after attachment. Orphaned temp assets (uploaded but post never saved) accumulate in storage and the database with no cleanup.

---

## Goal

When a post is saved successfully, physically move the cover image object in MinIO from the `tmp` path to a permanent path keyed by the post ID. Update the stored `ObjectKey` to reflect the new location. Clean up orphaned temporary assets on a background schedule.

---

## Current Behavior

1. User uploads image → stored at `covers/tmp/{yyyy/MM}/{mediaAssetId:N}-filename.jpg`, `Status = Temporary`.
2. Post is saved → `AttachToPostAsync` sets `PostId` and `Status = Attached` but leaves `ObjectKey` pointing at the tmp path.
3. No cleanup job exists; temp assets accumulate indefinitely.

---

## Target Behavior

1. User uploads image → stored at `covers/tmp/{yyyy/MM}/{mediaAssetId:N}-filename.jpg`, `Status = Temporary`. (unchanged)
2. Post is saved → `AttachToPostAsync`:
   - Builds the permanent key: `covers/{postId:N}/{yyyy/MM}/{mediaAssetId:N}-filename.jpg` (same date segment as in the existing key).
   - Copies the object to the new key in MinIO.
   - Deletes the old temp object from MinIO.
   - Updates `MediaAsset.ObjectKey` to the new key.
   - Sets `PostId` and `Status = Attached`.
3. A background service runs every hour, deletes from MinIO and the DB any asset where `Status = Temporary` and `CreatedAtUtc < UTC_NOW - 24h`.

---

## Scope

In scope:
- Add `MoveAsync(sourceKey, destKey)` to `IObjectStorage` and `MinioObjectStorage` (copy + delete).
- Add `UpdateObjectKey(newKey)` domain method on `MediaAsset`.
- Update `MediaService.AttachToPostAsync` to rebuild the permanent key, call move, and update the entity.
- Add a permanent-key builder helper (extracted from the existing upload key logic).
- Add `CleanupTemporaryMediaService : BackgroundService` using `PeriodicTimer` (1-hour interval).
- Register the background service in the module's DI entry point.

Out of scope:
- Frontend changes.
- Inline image kind (same pattern but content JSON URLs would need rewriting — separate spec).
- Updating post cover URL already stored in the frontend's React state (URL shown during editing session is still the temp URL until re-fetch; acceptable since reads hit the DB which has the new key).
- MinIO bucket policy or pre-signed URL changes.
- Adding an admin endpoint to trigger cleanup manually.

---

## Files to Touch

| File | Change |
|---|---|
| `backend/Modules/Blog/Niklabs.Blog.Infrastructure/Storage/IObjectStorage.cs` | Add `MoveAsync` |
| `backend/Modules/Blog/Niklabs.Blog.Infrastructure/Storage/MinioObjectStorage.cs` | Implement `MoveAsync` via copy + delete |
| `backend/Modules/Blog/Niklabs.Blog.Domain/Media/MediaAsset.cs` | Add `UpdateObjectKey(string newKey)` |
| `backend/Modules/Blog/Niklabs.Blog.Infrastructure/Storage/MediaService.cs` | Update `AttachToPostAsync`, extract key builder |
| `backend/Modules/Blog/Niklabs.Blog.Infrastructure/Storage/CleanupTemporaryMediaService.cs` | New `BackgroundService` |
| `backend/Modules/Blog/Niklabs.Blog.Infrastructure/DependencyInjection/ServiceCollectionExtensions.cs` | Register background service |

---

## Implementation Plan

### 1. `IObjectStorage` — add MoveAsync

```csharp
Task MoveAsync(string sourceKey, string destKey, CancellationToken ct = default);
```

### 2. `MinioObjectStorage` — implement MoveAsync

MinIO has no server-side move; use copy + delete.

```csharp
public async Task MoveAsync(string sourceKey, string destKey, CancellationToken ct = default)
{
    await _minioClient.CopyObjectAsync(new CopyObjectArgs()
        .WithBucket(_options.Bucket)
        .WithObject(destKey)
        .WithCopyObjectSource(new CopySourceObjectArgs()
            .WithBucket(_options.Bucket)
            .WithObject(sourceKey)), ct);

    await _minioClient.RemoveObjectAsync(new RemoveObjectArgs()
        .WithBucket(_options.Bucket)
        .WithObject(sourceKey), ct);
}
```

### 3. `MediaAsset` domain model — add UpdateObjectKey

```csharp
public void UpdateObjectKey(string newObjectKey)
{
    ObjectKey = newObjectKey;
    UpdatedAtUtc = DateTimeOffset.UtcNow;
}
```

### 4. `MediaService` — extract key builder, update AttachToPostAsync

Extract the key-building logic into a private `BuildObjectKey` method:

```csharp
private static string BuildObjectKey(
    MediaAssetKind kind,
    Guid? postId,
    Guid mediaAssetId,
    string sanitizedFileName,
    DateTimeOffset createdAt)
{
    var scope = kind == MediaAssetKind.Cover ? "covers" : "posts";
    var owner = postId?.ToString("N") ?? "tmp";
    return $"{scope}/{owner}/{createdAt:yyyy/MM}/{mediaAssetId:N}-{sanitizedFileName}";
}
```

Update `AttachToPostAsync` to move the object and update `ObjectKey`:

```csharp
public async Task AttachToPostAsync(Guid mediaAssetId, Guid postId, CancellationToken ct = default)
{
    var asset = await _dbContext.MediaAssets.FindAsync([mediaAssetId], ct)
        ?? throw new InvalidOperationException($"MediaAsset {mediaAssetId} not found.");

    var sanitizedFileName = ExtractSanitizedFileName(asset.ObjectKey);
    var permanentKey = BuildObjectKey(asset.Kind, postId, asset.Id, sanitizedFileName, asset.CreatedAtUtc);

    await _objectStorage.MoveAsync(asset.ObjectKey, permanentKey, ct);

    asset.UpdateObjectKey(permanentKey);
    asset.AttachToPost(postId);

    await _dbContext.SaveChangesAsync(ct);
}
```

`ExtractSanitizedFileName` parses the filename portion from the end of the existing `ObjectKey` — everything after the last `/` stripped of the leading `{mediaAssetId:N}-` prefix.

### 5. `CleanupTemporaryMediaService`

```csharp
internal sealed class CleanupTemporaryMediaService(
    IServiceScopeFactory scopeFactory,
    ILogger<CleanupTemporaryMediaService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromHours(1));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await CleanupAsync(stoppingToken);
        }
    }

    private async Task CleanupAsync(CancellationToken ct)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
        var storage = scope.ServiceProvider.GetRequiredService<IObjectStorage>();

        var cutoff = DateTimeOffset.UtcNow.AddHours(-24);
        var stale = await db.MediaAssets
            .Where(a => a.Status == MediaAssetStatus.Temporary && a.CreatedAtUtc < cutoff)
            .ToListAsync(ct);

        foreach (var asset in stale)
        {
            try
            {
                await storage.DeleteAsync(asset.ObjectKey, ct);
                db.MediaAssets.Remove(asset);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to clean up temp asset {Id}", asset.Id);
            }
        }

        await db.SaveChangesAsync(ct);
    }
}
```

### 6. Register in DI

In `ServiceCollectionExtensions.cs`:

```csharp
services.AddHostedService<CleanupTemporaryMediaService>();
```

---

## Acceptance Criteria

- After uploading an image and saving a post, the object key in `post.MediaAssets` matches `covers/{postId:N}/{yyyy/MM}/...` (no `tmp` segment).
- The old `tmp` path no longer exists in MinIO after post save.
- The new permanent path is accessible via the public URL returned by `GetPostById`.
- Temporary assets older than 24 hours are removed from both MinIO and the DB on the next cleanup tick.
- Assets with `Status = Attached` are never touched by the cleanup job.
- Backend builds with no errors (`dotnet build`).
- Existing post create and update integration tests pass.

---

## Out of Scope

- Frontend changes.
- Inline image kind.
- New EF migrations (no schema change needed).
- Admin endpoint for manual cleanup trigger.
