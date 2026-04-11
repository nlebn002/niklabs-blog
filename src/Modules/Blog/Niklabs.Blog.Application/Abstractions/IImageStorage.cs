namespace Niklabs.Blog.Application.Abstractions;

public interface IImageStorage
{
    Task<string> SaveAsync(Stream stream, string fileName, CancellationToken cancellationToken);
}
