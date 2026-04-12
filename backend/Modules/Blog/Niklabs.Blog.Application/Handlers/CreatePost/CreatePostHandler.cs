using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Handlers.CreatePost;

public sealed class CreatePostHandler(IBlogDbContext dbContext)
{
    public async Task<(bool Success, string? Error, PostDto? Post)> ExecuteAsync(
        UpsertPostCommand command,
        CancellationToken cancellationToken)
    {
        var post = Post.Create(
            command.Title,
            command.Excerpt,
            command.ContentMarkdown,
            command.CoverImageUrl,
            command.IsPublished,
            DateTimeOffset.UtcNow);

        await dbContext.Posts.AddAsync(post, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return (true, null, post.ToDto());
    }
}
