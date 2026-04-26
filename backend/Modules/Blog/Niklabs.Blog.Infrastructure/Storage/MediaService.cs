using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Domain.Media;
using Niklabs.Blog.Infrastructure.Persistence;
using SixLabors.ImageSharp;

namespace Niklabs.Blog.Infrastructure.Storage;

public sealed class MediaService(IBlogDbContext dbContext, IObjectStorage objectStorage) : IMediaService
{
    private static readonly HashSet<string> AllowedContentTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    public async Task<MediaAssetUploadResult> UploadImageAsync(MediaAssetUploadRequest request, CancellationToken cancellationToken)
    {
        ValidateRequest(request);

        await using var bufferedStream = new MemoryStream();
        await request.Content.CopyToAsync(bufferedStream, cancellationToken);
        bufferedStream.Position = 0;

        var imageInfo = await Image.IdentifyAsync(bufferedStream, cancellationToken)
            ?? throw new InvalidOperationException("Uploaded file is not a valid image.");

        bufferedStream.Position = 0;

        var mediaAssetId = Guid.NewGuid();
        var objectKey = BuildObjectKey(mediaAssetId, request.Kind, request.FileName, request.PostId);

        await objectStorage.UploadAsync(
            new ObjectStorageUploadRequest(
                objectKey,
                request.ContentType,
                bufferedStream.Length,
                bufferedStream,
                Overwrite: false),
            cancellationToken);

        var mediaAsset = MediaAsset.Create(
            request.UploadedByUserId,
            objectKey,
            request.FileName,
            request.ContentType,
            bufferedStream.Length,
            imageInfo.Width,
            imageInfo.Height,
            request.Kind,
            DateTimeOffset.UtcNow,
            request.PostId,
            request.AltText,
            mediaAssetId);

        await dbContext.MediaAssets.AddAsync(mediaAsset, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new MediaAssetUploadResult(
            mediaAsset.Id,
            mediaAsset.PostId,
            mediaAsset.Kind,
            mediaAsset.ObjectKey,
            objectStorage.GetPublicUrl(mediaAsset.ObjectKey),
            mediaAsset.ContentType,
            mediaAsset.SizeBytes,
            mediaAsset.Width,
            mediaAsset.Height,
            mediaAsset.AltText);
    }

    public async Task DeleteAsync(Guid mediaAssetId, CancellationToken cancellationToken)
    {
        var mediaAsset = await dbContext.MediaAssets.FirstOrDefaultAsync(x => x.Id == mediaAssetId, cancellationToken)
            ?? throw new InvalidOperationException("Media asset not found.");

        mediaAsset.MarkDeleted(DateTimeOffset.UtcNow);
        await objectStorage.DeleteAsync(mediaAsset.ObjectKey, cancellationToken);
        dbContext.MediaAssets.Remove(mediaAsset);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AttachToPostAsync(Guid mediaAssetId, Guid postId, CancellationToken cancellationToken)
    {
        var mediaAsset = await dbContext.MediaAssets.FirstOrDefaultAsync(x => x.Id == mediaAssetId, cancellationToken)
            ?? throw new InvalidOperationException("Media asset not found.");

        mediaAsset.AttachToPost(postId, DateTimeOffset.UtcNow);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void ValidateRequest(MediaAssetUploadRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FileName))
        {
            throw new ArgumentException("File name is required.", nameof(request));
        }

        if (!AllowedContentTypes.Contains(request.ContentType))
        {
            throw new InvalidOperationException("Unsupported image type.");
        }

        if (request.ContentLength <= 0)
        {
            throw new InvalidOperationException("Image content is empty.");
        }

        if (request.ContentLength > 5 * 1024 * 1024)
        {
            throw new InvalidOperationException("Image exceeds the 5 MB limit.");
        }
    }

    private static string BuildObjectKey(Guid mediaAssetId, MediaAssetKind kind, string fileName, Guid? postId)
    {
        var now = DateTimeOffset.UtcNow;
        var sanitizedFileName = Path.GetFileName(fileName).Replace(' ', '-');
        var scope = kind == MediaAssetKind.Cover ? "covers" : "posts";
        var owner = postId?.ToString("N") ?? "tmp";
        return $"{scope}/{owner}/{now:yyyy/MM}/{mediaAssetId:N}-{sanitizedFileName}";
    }
}
