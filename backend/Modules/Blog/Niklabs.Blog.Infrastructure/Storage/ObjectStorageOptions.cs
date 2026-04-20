namespace Niklabs.Blog.Infrastructure.Storage;

public sealed class ObjectStorageOptions
{
    public const string SectionName = "ObjectStorage";

    public string Endpoint { get; init; } = string.Empty;

    public string AccessKey { get; init; } = string.Empty;

    public string SecretKey { get; init; } = string.Empty;

    public string Bucket { get; init; } = string.Empty;

    public bool UseSsl { get; init; }

    public string PublicBaseUrl { get; init; } = string.Empty;
}
