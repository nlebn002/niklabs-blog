using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Application.Handlers.GetPosts;

namespace Niklabs.Blog.Api.Endpoints.Posts;

public static class GetPostsEndpoint
{
    public static RouteGroupBuilder MapGetPostsEndpoint(this RouteGroupBuilder posts)
    {
        posts.MapGet("/", async (bool? isPublished, bool? onlyEditable, GetPostsHandler handler, CancellationToken cancellationToken) =>
        {
            var items = await handler.ExecuteAsync(
                new GetPostsQuery(onlyEditable ?? false, isPublished),
                cancellationToken);
            return Results.Ok(items);
        })
        .Produces<IReadOnlyList<PostDto>>(StatusCodes.Status200OK);

        return posts;
    }
}
