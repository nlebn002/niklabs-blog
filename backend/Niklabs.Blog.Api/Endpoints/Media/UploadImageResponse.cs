namespace Niklabs.Blog.Api.Endpoints.Media;

public sealed record UploadImageResponse(
    Guid MediaAssetId,
    string PublicUrl,
    string ContentType,
    long SizeBytes,
    int Width,
    int Height,
    string? AltText);
