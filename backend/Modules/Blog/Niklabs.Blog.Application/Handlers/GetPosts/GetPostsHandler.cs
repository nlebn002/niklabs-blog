using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Application.Handlers.GetPosts;

public sealed class GetPostsHandler(IBlogDbContext dbContext)
{
    public async Task<IReadOnlyList<PostDto>> ExecuteAsync(GetPostsQuery query, CancellationToken cancellationToken)
    {
        var posts = dbContext.Posts.AsNoTracking();

        if (query.IsPublished.HasValue)
        {
            posts = posts.Where(x => x.IsPublished == query.IsPublished.Value);
        }

        var items = await posts
            .OrderByDescending(x => x.IsPublished)
            .ThenByDescending(x => x.PublishedAtUtc)
            .ThenByDescending(x => x.UpdatedAtUtc)
            .ThenByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return items.Select(x => x.ToDto()).ToList();
    }
}

public sealed record GetPostsQuery(bool? IsPublished);
