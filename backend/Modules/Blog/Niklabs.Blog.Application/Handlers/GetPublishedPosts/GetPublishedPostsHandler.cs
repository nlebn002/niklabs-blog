using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Application.Handlers.GetPublishedPosts;

public sealed class GetPublishedPostsHandler(IBlogDbContext dbContext)
{
    public async Task<IReadOnlyList<PostDto>> ExecuteAsync(CancellationToken cancellationToken)
    {
        var items = await dbContext.Posts
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderByDescending(x => x.PublishedAtUtc)
            .ThenByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return items.Select(x => x.ToDto()).ToList();
    }
}
