using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Application.Handlers.GetPostById;

public sealed class GetPostByIdHandler(IBlogDbContext dbContext)
{
    public async Task<PostDto?> ExecuteAsync(GetPostByIdQuery query, CancellationToken cancellationToken)
    {
        var post = await dbContext.Posts
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == query.Id && x.IsPublished,
                cancellationToken);

        return post?.ToDto();
    }
}

public sealed record GetPostByIdQuery(Guid Id);
