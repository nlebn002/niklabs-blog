using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Dtos;

public sealed record PostDto(
    Guid Id,
    string Title,
    string Slug,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished,
    DateTimeOffset? PublishedAtUtc,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

internal static class PostDtoMappings
{
    public static PostDto ToDto(this BlogPost post) =>
        new(
            post.Id,
            post.Title,
            post.Slug,
            post.Excerpt,
            post.ContentMarkdown,
            post.CoverImageUrl,
            post.IsPublished,
            post.PublishedAtUtc,
            post.CreatedAtUtc,
            post.UpdatedAtUtc);
}
