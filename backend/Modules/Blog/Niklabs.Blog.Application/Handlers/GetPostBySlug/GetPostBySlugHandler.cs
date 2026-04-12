using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Application.Handlers.GetPostBySlug;

public sealed class GetPostBySlugHandler(IBlogDbContext dbContext)
{
    public async Task<PostDto?> ExecuteAsync(GetPostBySlugQuery query, CancellationToken cancellationToken)
    {
        var post = await dbContext.Posts
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Slug == query.Slug.ToLowerInvariant() && x.IsPublished,
                cancellationToken);

        return post?.ToDto();
    }
}

public sealed record GetPostBySlugQuery(string Slug);
