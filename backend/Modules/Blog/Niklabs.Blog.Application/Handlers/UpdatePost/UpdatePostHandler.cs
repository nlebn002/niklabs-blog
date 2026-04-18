using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Application.Handlers.UpdatePost;

public sealed class UpdatePostHandler(
    IBlogDbContext dbContext,
    TimeProvider timeProvider,
    ICurrentUser currentUser,
    IPostAuthorizationService authorizationService)
{
    public async Task<(bool Found, bool Success, string? Error, PostDto? Post)> ExecuteAsync(
        UpdatePostCommand command,
        CancellationToken cancellationToken)
    {
        var post = await dbContext.Posts
            .FirstOrDefaultAsync(x => x.Id == command.PostId && !x.IsDeleted, cancellationToken);

        if (post is null)
        {
            return (false, false, null, null);
        }

        if (!authorizationService.CanEdit(currentUser, post))
        {
            return (true, false, "Forbidden", null);
        }

        post.Update(
            command.Title,
            command.Excerpt,
            command.ContentMarkdown,
            command.CoverImageUrl,
            command.IsPublished,
            timeProvider.GetUtcNow());

        await dbContext.SaveChangesAsync(cancellationToken);

        return (true, true, null, post.ToDto());
    }
}

public sealed record UpdatePostCommand(
    Guid PostId,
    string Title,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished);
