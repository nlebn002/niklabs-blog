namespace Niklabs.Blog.Infrastructure.Storage;

public sealed class StorageOptions
{
    public const string SectionName = "Storage";

    public string UploadsPath { get; set; } = "uploads";
    public string PublicBasePath { get; set; } = "/uploads";
}
