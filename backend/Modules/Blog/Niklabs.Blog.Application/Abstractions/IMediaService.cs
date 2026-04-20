namespace Niklabs.Blog.Application.Abstractions;

public interface IMediaService
{
    Task<MediaAssetUploadResult> UploadImageAsync(MediaAssetUploadRequest request, CancellationToken cancellationToken);

    Task DeleteAsync(Guid mediaAssetId, CancellationToken cancellationToken);

    Task AttachToPostAsync(Guid mediaAssetId, Guid postId, CancellationToken cancellationToken);
}
