using Niklabs.Blog.Application.Handlers.DeletePost;

namespace Niklabs.Blog.Api.Endpoints;

public static class DeletePostEndpoint
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapDelete("/posts/{id:guid}", async (
            Guid id,
            DeletePostHandler handler,
            CancellationToken cancellationToken) =>
        {
            var deleted = await handler.ExecuteAsync(new DeletePostCommand(id), cancellationToken);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
