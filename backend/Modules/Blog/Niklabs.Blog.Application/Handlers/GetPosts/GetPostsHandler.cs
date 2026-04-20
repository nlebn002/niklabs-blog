using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Domain.Posts;

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
                if (query.Status.HasValue)
                {
                    posts = posts.Where(x => x.Status == query.Status.Value);
                }
            }
            else if (currentUser.UserId.HasValue)
            {
                posts = posts.Where(x => x.AuthorUserId == currentUser.UserId.Value);

                if (query.Status.HasValue)
                {
                    posts = posts.Where(x => x.Status == query.Status.Value);
                }
            }
            else
            {
                posts = posts.Where(x => x.Status == PostStatus.Published);
            }
        }
        else if (query.Status.HasValue)
        {
            posts = posts.Where(x => x.Status == query.Status.Value);
        }
        else
        {
            posts = posts.Where(x => x.Status == PostStatus.Published);
        }

        var items = await posts
            .OrderByDescending(x => x.Status == PostStatus.Published)
            .ThenByDescending(x => x.PublishedAtUtc)
            .ThenByDescending(x => x.UpdatedAtUtc)
            .ThenByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return items.Select(x => x.ToDto()).ToList();
    }
}

public sealed record GetPostsQuery(bool OnlyEditablePosts = false, PostStatus? Status = null);
