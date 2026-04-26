using Niklabs.Blog.Api.Auth;
using Niklabs.Blog.Application.Dtos;
using Niklabs.Blog.Application.Handlers.CreatePost;

namespace Niklabs.Blog.Api.Endpoints.Posts;

public static class CreatePostEndpoint
{
    public static RouteGroupBuilder MapCreatePostEndpoint(this RouteGroupBuilder posts)
    {
        posts.MapPost("/", async (
            UpsertPostRequest request,
            CreatePostHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.ExecuteAsync(
                new CreatePostCommand(
                    request.Title,
                    request.Slug,
                    request.Excerpt,
                    request.ContentJson,
                    request.CoverImageMediaAssetId,
                    request.Status,
                    request.SeoTitle,
                    request.SeoDescription),
                cancellationToken);

            if (!result.Success)
            {
                return Results.Forbid();
            }

            return Results.Created($"/api/posts/{result.Post!.Id}", result.Post);
        })
        .RequireAuthorization("CanCreatePosts")
        .AddEndpointFilter<AntiforgeryValidationFilter>()
        .Produces<PostDto>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status403Forbidden);

        return posts;
    }
}
