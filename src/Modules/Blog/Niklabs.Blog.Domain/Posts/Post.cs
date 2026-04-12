namespace Niklabs.Blog.Domain.Posts;

public sealed class Post
{
    private Post()
    {
    }

    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string Excerpt { get; private set; } = string.Empty;
    public string ContentMarkdown { get; private set; } = string.Empty;
    public string? CoverImageUrl { get; private set; }
    public bool IsPublished { get; private set; }
    public DateTimeOffset? PublishedAtUtc { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }
    public DateTimeOffset UpdatedAtUtc { get; private set; }

    public static Post Create(
        string title,
        string slug,
        string excerpt,
        string contentMarkdown,
        string? coverImageUrl,
        bool isPublished,
        DateTimeOffset nowUtc)
    {
        var post = new Post
        {
            Id = Guid.NewGuid(),
            CreatedAtUtc = nowUtc,
            UpdatedAtUtc = nowUtc
        };

        post.Update(title, slug, excerpt, contentMarkdown, coverImageUrl, isPublished, nowUtc);
        return post;
    }

    public void Update(
        string title,
        string slug,
        string excerpt,
        string contentMarkdown,
        string? coverImageUrl,
        bool isPublished,
        DateTimeOffset nowUtc)
    {
        Title = title.Trim();
        Slug = slug.Trim().ToLowerInvariant();
        Excerpt = excerpt.Trim();
        ContentMarkdown = contentMarkdown.Trim();
        CoverImageUrl = string.IsNullOrWhiteSpace(coverImageUrl) ? null : coverImageUrl.Trim();
        UpdatedAtUtc = nowUtc;

        if (isPublished)
        {
            Publish(nowUtc);
        }
        else
        {
            Unpublish();
        }
    }

    private void Publish(DateTimeOffset nowUtc)
    {
        IsPublished = true;
        PublishedAtUtc ??= nowUtc;
    }

    private void Unpublish()
    {
        IsPublished = false;
        PublishedAtUtc = null;
    }
}
