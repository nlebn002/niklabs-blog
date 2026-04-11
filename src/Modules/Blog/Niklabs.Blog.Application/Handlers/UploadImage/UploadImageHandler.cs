using Niklabs.Blog.Application.Abstractions;

namespace Niklabs.Blog.Application.Handlers.UploadImage;

public sealed class UploadImageHandler(IImageStorage imageStorage)
{
    public Task<string> ExecuteAsync(Stream stream, string fileName, CancellationToken cancellationToken) =>
        imageStorage.SaveAsync(stream, fileName, cancellationToken);
}
