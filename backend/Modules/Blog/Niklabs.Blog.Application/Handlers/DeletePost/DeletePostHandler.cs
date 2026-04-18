using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;

namespace Niklabs.Blog.Application.Handlers.DeletePost;

public sealed class DeletePostHandler(
    IBlogDbContext dbContext,
    ICurrentUser currentUser,
    IPostAuthorizationService authorizationService)
{
    public async Task<(bool Found, bool Deleted, string? Error)> ExecuteAsync(DeletePostCommand command, CancellationToken cancellationToken)
    {
        var post = await dbContext.Posts
            .FirstOrDefaultAsync(x => x.Id == command.PostId && !x.IsDeleted, cancellationToken);

        if (post is null)
        {
            return (false, false, null);
        }

        if (!authorizationService.CanDelete(currentUser, post))
        {
            return (true, false, "Forbidden");
        }

        post.Delete();
        await dbContext.SaveChangesAsync(cancellationToken);

        return (true, true, null);
    }
}

public sealed record DeletePostCommand(Guid PostId);
