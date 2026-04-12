using Niklabs.Blog.Application.Handlers.GetPublishedPosts;

namespace Niklabs.Blog.Api.Endpoints;

public static class GetPublishedPostsEndpoint
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/", async (GetPublishedPostsHandler handler, CancellationToken cancellationToken) =>
        {
            var items = await handler.ExecuteAsync(cancellationToken);
            return Results.Ok(items);
        });
    }
}
