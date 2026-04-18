using Niklabs.Blog.Api.Auth;
using Niklabs.Blog.Application.Handlers.DeletePost;

namespace Niklabs.Blog.Api.Endpoints.Posts;

public static class DeletePostEndpoint
{
    public static RouteGroupBuilder MapDeletePostEndpoint(this RouteGroupBuilder posts)
    {
        posts.MapDelete("/{id:guid}", async (
            Guid id,
            DeletePostHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.ExecuteAsync(
                new DeletePostCommand(id),
                cancellationToken);

            if (!result.Found)
            {
                return Results.NotFound();
            }

            if (!result.Deleted)
            {
                return Results.Forbid();
            }

            return Results.NoContent();
        })
        .RequireAuthorization("CanCreatePosts")
        .AddEndpointFilter<AntiforgeryValidationFilter>()
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status403Forbidden);

        return posts;
    }
}
