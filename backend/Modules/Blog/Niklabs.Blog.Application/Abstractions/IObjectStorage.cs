namespace Niklabs.Blog.Application.Abstractions;

public interface IObjectStorage
{
    Task<ObjectStorageUploadResult> UploadAsync(ObjectStorageUploadRequest request, CancellationToken cancellationToken);

    Task DeleteAsync(string objectKey, CancellationToken cancellationToken);

    Task<bool> ExistsAsync(string objectKey, CancellationToken cancellationToken);

    string GetPublicUrl(string objectKey);
}
