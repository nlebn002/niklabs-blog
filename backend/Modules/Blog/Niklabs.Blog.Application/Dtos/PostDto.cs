using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Dtos;

public sealed record PostDto(
    Guid Id,
    Guid AuthorUserId,
    string Title,
    string Slug,
    string Excerpt,
    string ContentJson,
    string ContentHtml,
    string ContentText,
    Guid? CoverImageMediaAssetId,
    string? CoverImageUrl,
    PostStatus Status,
    string? SeoTitle,
    string? SeoDescription,
    DateTimeOffset? PublishedAtUtc,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

internal static class PostDtoMappings
{
    public static PostDto ToDto(this Post post, string? coverImageUrl = null) =>
        new(
            post.Id,
            post.AuthorUserId,
            post.Title,
            post.Slug,
            post.Excerpt,
            post.ContentJson,
            post.ContentHtml,
            post.ContentText,
            post.CoverImageMediaAssetId,
            coverImageUrl,
            post.Status,
            post.SeoTitle,
            post.SeoDescription,
            post.PublishedAtUtc,
            post.CreatedAtUtc,
            post.UpdatedAtUtc);
}
