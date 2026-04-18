using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Application.Handlers.GetPostById;

public sealed class GetPostByIdHandler(
    IBlogDbContext dbContext,
    ICurrentUser currentUser,
    IPostAuthorizationService authorizationService)
{
    public async Task<PostDto?> ExecuteAsync(GetPostByIdQuery query, CancellationToken cancellationToken)
    {
        var post = await dbContext.Posts
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == query.Id && !x.IsDeleted,
                cancellationToken);

        if (post is null || !authorizationService.CanView(currentUser, post))
        {
            return null;
        }

        return post.ToDto();
    }
}

public sealed record GetPostByIdQuery(Guid Id);
