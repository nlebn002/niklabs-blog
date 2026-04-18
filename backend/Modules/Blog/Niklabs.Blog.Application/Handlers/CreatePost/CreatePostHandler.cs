using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Handlers.CreatePost;

public sealed class CreatePostHandler(
    IBlogDbContext dbContext,
    ICurrentUser currentUser,
    IPostAuthorizationService authorizationService)
{
    public async Task<(bool Success, string? Error, PostDto? Post)> ExecuteAsync(
        CreatePostCommand command,
        CancellationToken cancellationToken)
    {
        if (!authorizationService.CanCreate(currentUser) || !currentUser.UserId.HasValue)
        {
            return (false, "Forbidden", null);
        }

        var post = Post.Create(
            currentUser.UserId.Value,
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

public sealed record CreatePostCommand(
    string Title,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished);
