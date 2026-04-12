using Niklabs.Blog.Application.Handlers.GetPostBySlug;

namespace Niklabs.Blog.Api.Endpoints;

public static class GetPostBySlugEndpoint
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/{slug}", async (string slug, GetPostBySlugHandler handler, CancellationToken cancellationToken) =>
        {
            var post = await handler.ExecuteAsync(new GetPostBySlugQuery(slug), cancellationToken);
            return post is null ? Results.NotFound() : Results.Ok(post);
        });
    }
}
