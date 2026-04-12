using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;

namespace Niklabs.Blog.Application.Handlers.DeletePost;

public sealed class DeletePostHandler(IBlogDbContext dbContext)
{
    public async Task<bool> ExecuteAsync(DeletePostCommand command, CancellationToken cancellationToken)
    {
        var post = await dbContext.Posts.FirstOrDefaultAsync(x => x.Id == command.PostId, cancellationToken);
        if (post is null)
        {
            return false;
        }

        post.Delete();
        await dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }
}

public sealed record DeletePostCommand(Guid PostId);
