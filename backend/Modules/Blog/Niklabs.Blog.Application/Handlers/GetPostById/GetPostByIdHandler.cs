using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Application.Handlers.GetPostById;

public sealed class GetPostByIdHandler(
    IBlogDbContext dbContext,
    ICurrentUser currentUser,
    IPostAuthorizationService authorizationService,
    IObjectStorage objectStorage)
{
    public async Task<PostDto?> ExecuteAsync(GetPostByIdQuery query, CancellationToken cancellationToken)
    {
        var post = await dbContext.Posts
            .AsNoTracking()
            .Include(x => x.CoverImageMediaAsset)
            .FirstOrDefaultAsync(x => x.Id == query.Id, cancellationToken);

        if (post is null || !authorizationService.CanView(currentUser, post))
        {
            return null;
        }

        return post.ToDto(post.CoverImageMediaAsset is null ? null : objectStorage.GetPublicUrl(post.CoverImageMediaAsset.ObjectKey));
    }
}

public sealed record GetPostByIdQuery(Guid Id);
