using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Dtos;

public sealed record PostDto(
    Guid Id,
    Guid AuthorUserId,
    string Title,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished,
    DateTimeOffset? PublishedAtUtc,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

internal static class PostDtoMappings
{
    public static PostDto ToDto(this Post post) =>
        new(
            post.Id,
            post.AuthorUserId,
            post.Title,
            post.Excerpt,
            post.ContentMarkdown,
            post.CoverImageUrl,
            post.IsPublished,
            post.PublishedAtUtc,
            post.CreatedAtUtc,
            post.UpdatedAtUtc);
}
