using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Application.Handlers.GetPostById;

namespace Niklabs.Blog.Api.Endpoints.Posts;

public static class GetPostByIdEndpoint
{
    public static RouteGroupBuilder MapGetPostByIdEndpoint(this RouteGroupBuilder posts)
    {
        posts.MapGet("/{id:guid}", async (Guid id, GetPostByIdHandler handler, CancellationToken cancellationToken) =>
        {
            var post = await handler.ExecuteAsync(new GetPostByIdQuery(id), cancellationToken);
            return post is null ? Results.NotFound() : Results.Ok(post);
        })
        .Produces<PostDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        return posts;
    }
}
