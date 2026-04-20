namespace Niklabs.Blog.Application.Abstractions;

public sealed record ObjectStorageUploadRequest(
    string ObjectKey,
    string ContentType,
    long ContentLength,
    Stream Content,
    bool Overwrite = false);

public sealed record ObjectStorageUploadResult(
    string ObjectKey,
    string PublicUrl);
