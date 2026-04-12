namespace Niklabs.Blog.Application.Handlers;

public sealed record UpsertPostCommand(
    string Title,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished);
