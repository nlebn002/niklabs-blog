using Niklabs.Blog.Application.Handlers.UpdatePost;

namespace Niklabs.Blog.Api.Endpoints;

public static class UpdatePostEndpoint
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPut("/posts/{id:guid}", async (
            Guid id,
            UpsertPostRequest request,
            UpdatePostHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.ExecuteAsync(
                new UpdatePostCommand(
                    id,
                    request.Title,
                    request.Slug,
                    request.Excerpt,
                    request.ContentMarkdown,
                    request.CoverImageUrl,
                    request.IsPublished),
                cancellationToken);

            if (!result.Found)
            {
                return Results.NotFound();
            }

            if (!result.Success)
            {
                return Results.Conflict(new { message = result.Error });
            }

            return Results.Ok(result.Post);
        });
    }
}
