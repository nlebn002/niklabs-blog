using Niklabs.Blog.Domain.Media;

namespace Niklabs.Blog.Application.Abstractions;

public sealed record MediaAssetUploadRequest(
    Guid UploadedByUserId,
    string FileName,
    string ContentType,
    long ContentLength,
    Stream Content,
    MediaAssetKind Kind,
    Guid? PostId = null,
    string? AltText = null);

public sealed record MediaAssetUploadResult(
    Guid MediaAssetId,
    Guid? PostId,
    MediaAssetKind Kind,
    string ObjectKey,
    string PublicUrl,
    string ContentType,
    long SizeBytes,
    int Width,
    int Height,
    string? AltText);
