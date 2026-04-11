namespace Niklabs.Blog.Api.Endpoints;

public sealed record UpsertPostRequest(
    string Title,
    string? Slug,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished);
