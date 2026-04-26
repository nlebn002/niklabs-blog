using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Handlers.UpdatePost;

public sealed class UpdatePostHandler(
    IBlogDbContext dbContext,
    TimeProvider timeProvider,
    ICurrentUser currentUser,
    IPostAuthorizationService authorizationService,
    IPostContentProjectionService contentProjectionService,
    IMediaService mediaService,
    IObjectStorage objectStorage)
{
    public async Task<(bool Found, bool Success, string? Error, PostDto? Post)> ExecuteAsync(
        UpdatePostCommand command,
        CancellationToken cancellationToken)
    {
        var post = await dbContext.Posts
            .FirstOrDefaultAsync(x => x.Id == command.PostId, cancellationToken);

        if (post is null)
        {
            return (false, false, null, null);
        }

        if (!authorizationService.CanEdit(currentUser, post))
        {
            return (true, false, "Forbidden", null);
        }

        var content = contentProjectionService.Project(command.ContentJson);

        post.Update(
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
            timeProvider.GetUtcNow());

        await dbContext.SaveChangesAsync(cancellationToken);

        if (command.CoverImageMediaAssetId.HasValue)
        {
            await mediaService.AttachToPostAsync(command.CoverImageMediaAssetId.Value, post.Id, cancellationToken);
        }

        var coverImageUrl = await ResolveCoverImageUrlAsync(post.CoverImageMediaAssetId, cancellationToken);
        return (true, true, null, post.ToDto(coverImageUrl));
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

public sealed record UpdatePostCommand(
    Guid PostId,
    string Title,
    string Slug,
    string Excerpt,
    string ContentJson,
    Guid? CoverImageMediaAssetId,
    PostStatus Status,
    string? SeoTitle,
    string? SeoDescription);
