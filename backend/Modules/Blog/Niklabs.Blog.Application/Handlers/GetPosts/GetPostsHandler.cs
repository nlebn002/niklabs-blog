using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Application.Handlers.GetPosts;

public sealed class GetPostsHandler(IBlogDbContext dbContext, ICurrentUser currentUser)
{
    public async Task<IReadOnlyList<PostDto>> ExecuteAsync(GetPostsQuery query, CancellationToken cancellationToken)
    {
        var posts = dbContext.Posts
            .AsNoTracking();

        if (query.OnlyEditablePosts)
        {
            if (currentUser.IsAdmin)
            {
                if (query.IsPublished.HasValue)
                {
                    posts = posts.Where(x => x.IsPublished == query.IsPublished.Value);
                }
            }
            else if (currentUser.UserId.HasValue)
            {
                posts = posts.Where(x => x.AuthorUserId == currentUser.UserId.Value);

                if (query.IsPublished.HasValue)
                {
                    posts = posts.Where(x => x.IsPublished == query.IsPublished.Value);
                }
            }
            else
            {
                posts = posts.Where(x => x.IsPublished);
            }
        }
        else if (query.IsPublished.HasValue)
        {
            posts = posts.Where(x => x.IsPublished == query.IsPublished.Value);
        }
        else
        {
            posts = posts.Where(x => x.IsPublished);
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

public sealed record GetPostsQuery(bool OnlyEditablePosts = false, bool? IsPublished = null);
