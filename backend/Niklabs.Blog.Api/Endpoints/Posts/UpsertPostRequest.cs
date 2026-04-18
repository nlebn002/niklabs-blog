namespace Niklabs.Blog.Api.Endpoints.Posts;

public sealed record UpsertPostRequest(
    string Title,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished);
