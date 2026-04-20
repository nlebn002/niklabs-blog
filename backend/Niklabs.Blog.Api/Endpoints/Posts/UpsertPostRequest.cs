using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Api.Endpoints.Posts;

public sealed record UpsertPostRequest(
    string Title,
    string Slug,
    string Excerpt,
    string ContentJson,
    string ContentHtml,
    string ContentText,
    Guid? CoverImageMediaAssetId,
    PostStatus Status,
    string? SeoTitle,
    string? SeoDescription);
