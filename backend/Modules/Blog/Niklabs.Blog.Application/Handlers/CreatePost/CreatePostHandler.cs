using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Handlers.CreatePost;

public sealed class CreatePostHandler(
    IBlogDbContext dbContext,
    ICurrentUser currentUser,
    IPostAuthorizationService authorizationService,
    IPostContentProjectionService contentProjectionService,
    IMediaService mediaService,
    IObjectStorage objectStorage)
{
    public async Task<(bool Success, string? Error, PostDto? Post)> ExecuteAsync(
        CreatePostCommand command,
        CancellationToken cancellationToken)
    {
        if (!authorizationService.CanCreate(currentUser) || !currentUser.UserId.HasValue)
        {
            return (false, "Forbidden", null);
        }

        var content = contentProjectionService.Project(command.ContentJson);

        var post = Post.Create(
            currentUser.UserId.Value,
            command.Title,
            command.Slug,
            command.Excerpt,
            content.ContentJson,
            content.ContentHtml,
            content.ContentText,
            command.CoverImageMediaAssetId,
            command.Status,
            command.SeoTitle,
            command.SeoDescription,
            DateTimeOffset.UtcNow);

        await dbContext.Posts.AddAsync(post, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        if (command.CoverImageMediaAssetId.HasValue)
        {
            await mediaService.AttachToPostAsync(command.CoverImageMediaAssetId.Value, post.Id, cancellationToken);
        }

        var coverImageUrl = await ResolveCoverImageUrlAsync(post.CoverImageMediaAssetId, cancellationToken);
        return (true, null, post.ToDto(coverImageUrl));
    }

    private async Task<string?> ResolveCoverImageUrlAsync(Guid? mediaAssetId, CancellationToken cancellationToken)
    {
        if (!mediaAssetId.HasValue)
        {
            return null;
        }

        var mediaAsset = await dbContext.MediaAssets
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == mediaAssetId.Value, cancellationToken);

        return mediaAsset is null ? null : objectStorage.GetPublicUrl(mediaAsset.ObjectKey);
    }
}

public sealed record CreatePostCommand(
    string Title,
    string Slug,
    string Excerpt,
    string ContentJson,
    Guid? CoverImageMediaAssetId,
    PostStatus Status,
    string? SeoTitle,
    string? SeoDescription);
