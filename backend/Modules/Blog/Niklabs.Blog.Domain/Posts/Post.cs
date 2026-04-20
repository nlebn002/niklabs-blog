using Niklabs.Blog.Domain.Common;

namespace Niklabs.Blog.Domain.Posts;

public sealed class Post : AuditableEntity<Guid>
{
    private Post()
    {
    }

    public Guid AuthorUserId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Excerpt { get; private set; } = string.Empty;
    public string ContentMarkdown { get; private set; } = string.Empty;
    public string? CoverImageUrl { get; private set; }
    public bool IsPublished { get; private set; }
    public DateTimeOffset? PublishedAtUtc { get; private set; }
    public ICollection<PostTag> PostTags { get; private set; } = [];

    public static Post Create(
        Guid authorUserId,
        string title,
        string excerpt,
        string contentMarkdown,
        string? coverImageUrl,
        bool isPublished,
        DateTimeOffset nowUtc)
    {
        var post = new Post
        {
            Id = Guid.NewGuid(),
            AuthorUserId = authorUserId
        };

        post.SetCreated(nowUtc);
        post.Update(title, excerpt, contentMarkdown, coverImageUrl, isPublished, nowUtc);
        return post;
    }

    public void Update(
        string title,
        string excerpt,
        string contentMarkdown,
        string? coverImageUrl,
        bool isPublished,
        DateTimeOffset nowUtc)
    {
        Title = title.Trim();
        Excerpt = excerpt.Trim();
        ContentMarkdown = contentMarkdown.Trim();
        CoverImageUrl = string.IsNullOrWhiteSpace(coverImageUrl) ? null : coverImageUrl.Trim();
        Touch(nowUtc);

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
