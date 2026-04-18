using Niklabs.Blog.Api.Auth;
using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Application.Handlers.UpdatePost;

namespace Niklabs.Blog.Api.Endpoints.Posts;

public static class UpdatePostEndpoint
{
    public static RouteGroupBuilder MapUpdatePostEndpoint(this RouteGroupBuilder posts)
    {
        posts.MapPut("/{id:guid}", async (
            Guid id,
            UpsertPostRequest request,
            UpdatePostHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.ExecuteAsync(
                new UpdatePostCommand(
                    id,
                    request.Title,
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
                return Results.Forbid();
            }

            return Results.Ok(result.Post);
        })
        .RequireAuthorization("CanCreatePosts")
        .AddEndpointFilter<AntiforgeryValidationFilter>()
        .Produces<PostDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status403Forbidden);

        return posts;
    }
}
