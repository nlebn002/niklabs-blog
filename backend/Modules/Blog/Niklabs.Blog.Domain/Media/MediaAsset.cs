using Niklabs.Blog.Domain.Common;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Domain.Media;

public sealed class MediaAsset : AuditableEntity<Guid>
{
    private MediaAsset()
    {
    }

    public Guid UploadedByUserId { get; private set; }
    public string ObjectKey { get; private set; } = string.Empty;
    public string OriginalFileName { get; private set; } = string.Empty;
    public string ContentType { get; private set; } = string.Empty;
    public long SizeBytes { get; private set; }
    public int Width { get; private set; }
    public int Height { get; private set; }
    public string? AltText { get; private set; }
    public MediaAssetKind Kind { get; private set; }
    public MediaAssetStatus Status { get; private set; }
    public Guid? PostId { get; private set; }
    public Post? Post { get; private set; }

    public static MediaAsset Create(
        Guid uploadedByUserId,
        string objectKey,
        string originalFileName,
        string contentType,
        long sizeBytes,
        int width,
        int height,
        MediaAssetKind kind,
        DateTimeOffset nowUtc,
        Guid? postId = null,
        string? altText = null,
        Guid? id = null)
    {
        var mediaAsset = new MediaAsset
        {
            Id = id ?? Guid.NewGuid(),
            UploadedByUserId = uploadedByUserId,
            PostId = postId,
            ObjectKey = objectKey.Trim(),
            OriginalFileName = originalFileName.Trim(),
            ContentType = contentType.Trim(),
            SizeBytes = sizeBytes,
            Width = width,
            Height = height,
            AltText = string.IsNullOrWhiteSpace(altText) ? null : altText.Trim(),
            Kind = kind,
            Status = postId.HasValue ? MediaAssetStatus.Attached : MediaAssetStatus.Temporary
        };

        mediaAsset.SetCreated(nowUtc);
        return mediaAsset;
    }

    public void UpdateObjectKey(string newObjectKey, DateTimeOffset nowUtc)
    {
        ObjectKey = newObjectKey.Trim();
        Touch(nowUtc);
    }

    public void AttachToPost(Guid postId, DateTimeOffset nowUtc)
    {
        PostId = postId;
        Status = MediaAssetStatus.Attached;
        Touch(nowUtc);
    }

    public void MarkDeleted(DateTimeOffset nowUtc)
    {
        Status = MediaAssetStatus.Deleted;
        Touch(nowUtc);
    }

    public void UpdateAltText(string? altText, DateTimeOffset nowUtc)
    {
        AltText = string.IsNullOrWhiteSpace(altText) ? null : altText.Trim();
        Touch(nowUtc);
    }
}
