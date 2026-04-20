using Niklabs.Blog.Domain.Common;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Domain.Tags;

public sealed class Tag : AuditableEntity<Guid>
{
    private Tag()
    {
    }

    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;

    public ICollection<PostTag> PostTags { get; private set; } = [];

    public static Tag Create(string name, DateTimeOffset nowUtc)
    {
        var normalizedName = name.Trim();
        if (string.IsNullOrWhiteSpace(normalizedName))
        {
            throw new ArgumentException("Tag name is required.", nameof(name));
        }

        var tag = new Tag
        {
            Id = Guid.NewGuid(),
            Name = normalizedName,
            Slug = CreateSlug(normalizedName)
        };

        tag.SetCreated(nowUtc);
        return tag;
    }

    public void Rename(string name, DateTimeOffset nowUtc)
    {
        var normalizedName = name.Trim();
        if (string.IsNullOrWhiteSpace(normalizedName))
        {
            throw new ArgumentException("Tag name is required.", nameof(name));
        }

        Name = normalizedName;
        Slug = CreateSlug(normalizedName);
        Touch(nowUtc);
    }

    private static string CreateSlug(string value)
    {
        var chars = value
            .Trim()
            .ToLowerInvariant()
            .Select(static ch => char.IsLetterOrDigit(ch) ? ch : '-')
            .ToArray();

        var slug = new string(chars);
        while (slug.Contains("--", StringComparison.Ordinal))
        {
            slug = slug.Replace("--", "-", StringComparison.Ordinal);
        }

        return slug.Trim('-');
    }
}
