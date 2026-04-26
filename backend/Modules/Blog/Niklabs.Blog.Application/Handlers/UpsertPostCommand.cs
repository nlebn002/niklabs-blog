using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Handlers;

public sealed record UpsertPostCommand(
    string Title,
    string Slug,
    string Excerpt,
    string ContentJson,
    Guid? CoverImageMediaAssetId,
    PostStatus Status,
    string? SeoTitle,
    string? SeoDescription);
