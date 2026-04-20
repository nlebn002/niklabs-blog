using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Application.Handlers.GetPosts;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Api.Endpoints.Posts;

public static class GetPostsEndpoint
{
    public static RouteGroupBuilder MapGetPostsEndpoint(this RouteGroupBuilder posts)
    {
        posts.MapGet("/", async (PostStatus? status, bool? onlyEditable, GetPostsHandler handler, CancellationToken cancellationToken) =>
        {
            var items = await handler.ExecuteAsync(
                new GetPostsQuery(onlyEditable ?? false, status),
                cancellationToken);
            return Results.Ok(items);
        })
        .Produces<IReadOnlyList<PostDto>>(StatusCodes.Status200OK);

        return posts;
    }
}
