using Microsoft.Extensions.Options;
using Niklabs.Blog.Application.Abstractions;

namespace Niklabs.Blog.Infrastructure.Storage;

public sealed class LocalImageStorage(IOptions<StorageOptions> options) : IImageStorage
{
    private readonly StorageOptions _options = options.Value;

    public async Task<string> SaveAsync(Stream stream, string fileName, CancellationToken cancellationToken)
    {
        var uploadsPath = Path.GetFullPath(_options.UploadsPath);
        Directory.CreateDirectory(uploadsPath);

        var extension = Path.GetExtension(fileName);
        var safeExtension = string.IsNullOrWhiteSpace(extension) ? ".bin" : extension;
        var generatedName = $"{Guid.NewGuid():N}{safeExtension}";
        var fullPath = Path.Combine(uploadsPath, generatedName);

        await using var target = File.Create(fullPath);
        await stream.CopyToAsync(target, cancellationToken);

        return $"{_options.PublicBasePath.TrimEnd('/')}/{generatedName}";
    }
}
