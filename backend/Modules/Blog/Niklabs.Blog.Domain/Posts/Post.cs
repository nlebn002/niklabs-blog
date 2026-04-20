using Niklabs.Blog.Domain.Media;
using Niklabs.Blog.Domain.Common;

namespace Niklabs.Blog.Domain.Posts;

public sealed class Post : AuditableEntity<Guid>
{
    private Post()
    {
    }

    public Guid AuthorUserId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string Excerpt { get; private set; } = string.Empty;
    public string ContentJson { get; private set; } = string.Empty;
    public string ContentHtml { get; private set; } = string.Empty;
    public string ContentText { get; private set; } = string.Empty;
    public Guid? CoverImageMediaAssetId { get; private set; }
    public PostStatus Status { get; private set; }
    public string? SeoTitle { get; private set; }
    public string? SeoDescription { get; private set; }
    public DateTimeOffset? PublishedAtUtc { get; private set; }
    public ICollection<PostTag> PostTags { get; private set; } = [];
    public MediaAsset? CoverImageMediaAsset { get; private set; }

    public static Post Create(
        Guid authorUserId,
        string title,
        string slug,
        string excerpt,
        string contentJson,
        string contentHtml,
        string contentText,
        Guid? coverImageMediaAssetId,
        PostStatus status,
        string? seoTitle,
        string? seoDescription,
        DateTimeOffset nowUtc)
    {
        var post = new Post
        {
            Id = Guid.NewGuid(),
            AuthorUserId = authorUserId
        };

        post.SetCreated(nowUtc);
        post.Update(
            title,
            slug,
            excerpt,
            contentJson,
            contentHtml,
            contentText,
            coverImageMediaAssetId,
            status,
            seoTitle,
            seoDescription,
            nowUtc);
        return post;
    }

    public void Update(
        string title,
        string slug,
        string excerpt,
        string contentJson,
        string contentHtml,
        string contentText,
        Guid? coverImageMediaAssetId,
        PostStatus status,
        string? seoTitle,
        string? seoDescription,
        DateTimeOffset nowUtc)
    {
        Title = title.Trim();
        Slug = NormalizeSlug(slug);
        Excerpt = excerpt.Trim();
        ContentJson = RequireValue(contentJson, nameof(contentJson));
        ContentHtml = RequireValue(contentHtml, nameof(contentHtml));
        ContentText = RequireValue(contentText, nameof(contentText));
        CoverImageMediaAssetId = coverImageMediaAssetId;
        SeoTitle = NormalizeOptional(seoTitle);
        SeoDescription = NormalizeOptional(seoDescription);
        Touch(nowUtc);

        SetStatus(status, nowUtc);
    }

    private void SetStatus(PostStatus status, DateTimeOffset nowUtc)
    {
        Status = status;

        if (status == PostStatus.Published)
        {
            PublishedAtUtc ??= nowUtc;
            return;
        }

        if (status == PostStatus.Draft)
        {
            PublishedAtUtc = null;
        }
    }

    private static string RequireValue(string value, string parameterName)
    {
        var normalized = value.Trim();
        if (string.IsNullOrWhiteSpace(normalized))
        {
            throw new ArgumentException($"{parameterName} is required.", parameterName);
        }

        return normalized;
    }

    private static string? NormalizeOptional(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static string NormalizeSlug(string value)
    {
        var normalized = value
            .Trim()
            .ToLowerInvariant()
            .Select(static ch => char.IsLetterOrDigit(ch) ? ch : '-')
            .ToArray();

        var slug = new string(normalized);
        while (slug.Contains("--", StringComparison.Ordinal))
        {
            slug = slug.Replace("--", "-", StringComparison.Ordinal);
        }

        slug = slug.Trim('-');
        if (string.IsNullOrWhiteSpace(slug))
        {
            throw new ArgumentException("slug is required.", nameof(value));
        }

        return slug;
    }
}
