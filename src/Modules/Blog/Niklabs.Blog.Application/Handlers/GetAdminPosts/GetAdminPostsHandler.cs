using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Application.Handlers.GetAdminPosts;

public sealed class GetAdminPostsHandler(IBlogDbContext dbContext)
{
    public async Task<IReadOnlyList<PostDto>> ExecuteAsync(CancellationToken cancellationToken)
    {
        var items = await dbContext.Posts
            .AsNoTracking()
            .OrderByDescending(x => x.UpdatedAtUtc)
            .ToListAsync(cancellationToken);

        return items.Select(x => x.ToDto()).ToList();
    }
}
