namespace Niklabs.Blog.Application.Posts;

public sealed record UpsertPostCommand(
    string Title,
    string? Slug,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished);
