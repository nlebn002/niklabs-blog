using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Application.Handlers.Shared;
using Niklabs.Blog.Application.Posts;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Handlers.CreatePost;

public sealed class CreatePostHandler(IBlogDbContext dbContext)
{
    public async Task<(bool Success, string? Error, PostDto? Post)> ExecuteAsync(
        UpsertPostCommand command,
        CancellationToken cancellationToken)
    {
        var slug = SlugHelper.Generate(command.Title, command.Slug);
        var slugExists = await dbContext.Posts.AnyAsync(x => x.Slug == slug, cancellationToken);

        if (slugExists)
        {
            return (false, "Slug already exists.", null);
        }

        var post = Post.Create(
            command.Title,
            slug,
            command.Excerpt,
            command.ContentMarkdown,
            command.CoverImageUrl,
            command.IsPublished,
            DateTimeOffset.UtcNow);

        await dbContext.Posts.AddAsync(post, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return (true, null, post.ToDto());
    }
}
