using Niklabs.Blog.Application.Handlers.GetAdminPosts;

namespace Niklabs.Blog.Api.Endpoints;

public static class GetAdminPostsEndpoint
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/posts", async (GetAdminPostsHandler handler, CancellationToken cancellationToken) =>
        {
            var items = await handler.ExecuteAsync(cancellationToken);
            return Results.Ok(items);
        });
    }
}
