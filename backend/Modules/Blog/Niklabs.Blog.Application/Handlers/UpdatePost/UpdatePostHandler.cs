using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Application.Handlers.Shared;
using Niklabs.Blog.Application.Posts;

namespace Niklabs.Blog.Application.Handlers.UpdatePost;

public sealed class UpdatePostHandler(IBlogDbContext dbContext)
{
    public async Task<(bool Found, bool Success, string? Error, PostDto? Post)> ExecuteAsync(
        UpdatePostCommand command,
        CancellationToken cancellationToken)
    {
        var post = await dbContext.Posts.FirstOrDefaultAsync(x => x.Id == command.PostId, cancellationToken);
        if (post is null)
        {
            return (false, false, null, null);
        }

        var slug = SlugHelper.Generate(command.Title, command.Slug);
        var slugExists = await dbContext.Posts.AnyAsync(
            x => x.Slug == slug && x.Id != command.PostId,
            cancellationToken);

        if (slugExists)
        {
            return (true, false, "Slug already exists.", null);
        }

        post.Update(
            command.Title,
            slug,
            command.Excerpt,
            command.ContentMarkdown,
            command.CoverImageUrl,
            command.IsPublished,
            DateTimeOffset.UtcNow);

        await dbContext.SaveChangesAsync(cancellationToken);

        return (true, true, null, post.ToDto());
    }
}

public sealed record UpdatePostCommand(
    Guid PostId,
    string Title,
    string? Slug,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished);
