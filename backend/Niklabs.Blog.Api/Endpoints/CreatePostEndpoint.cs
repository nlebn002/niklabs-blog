using Niklabs.Blog.Application.Handlers.CreatePost;
using Niklabs.Blog.Application.Posts;

namespace Niklabs.Blog.Api.Endpoints;

public static class CreatePostEndpoint
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/posts", async (
            UpsertPostRequest request,
            CreatePostHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.ExecuteAsync(
                new UpsertPostCommand(
                    request.Title,
                    request.Slug,
                    request.Excerpt,
                    request.ContentMarkdown,
                    request.CoverImageUrl,
                    request.IsPublished),
                cancellationToken);

            if (!result.Success)
            {
                return Results.Conflict(new { message = result.Error });
            }

            return Results.Created($"/api/admin/posts/{result.Post!.Id}", result.Post);
        });
    }
}
