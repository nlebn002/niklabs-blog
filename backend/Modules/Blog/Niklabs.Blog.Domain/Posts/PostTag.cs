using Niklabs.Blog.Domain.Tags;

namespace Niklabs.Blog.Domain.Posts;

public sealed class PostTag
{
    private PostTag()
    {
    }

    public Guid PostId { get; private set; }
    public Guid TagId { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }

    public Post Post { get; private set; } = null!;
    public Tag Tag { get; private set; } = null!;

    public static PostTag Create(Guid postId, Guid tagId, DateTimeOffset nowUtc)
    {
        return new PostTag
        {
            PostId = postId,
            TagId = tagId,
            CreatedAtUtc = nowUtc
        };
    }
}
