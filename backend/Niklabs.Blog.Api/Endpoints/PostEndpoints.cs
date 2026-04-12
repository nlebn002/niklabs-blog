using Niklabs.Blog.Application.Handlers;
using Niklabs.Blog.Application.Handlers.CreatePost;
using Niklabs.Blog.Application.Handlers.DeletePost;
using Niklabs.Blog.Application.Handlers.GetPostById;
using Niklabs.Blog.Application.Handlers.GetPosts;
using Niklabs.Blog.Application.Handlers.UpdatePost;
using Niklabs.Blog.Application.Dtos;

namespace Niklabs.Blog.Api.Endpoints;

public static class PostEndpoints
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        var posts = endpoints.MapGroup("/api/posts").WithTags("Posts");

        posts.MapGet("/", async (bool? isPublished, GetPostsHandler handler, CancellationToken cancellationToken) =>
        {
            var items = await handler.ExecuteAsync(new GetPostsQuery(isPublished), cancellationToken);
            return Results.Ok(items);
        })
        .Produces<IReadOnlyList<PostDto>>(StatusCodes.Status200OK);

        posts.MapGet("/{id:guid}", async (Guid id, GetPostByIdHandler handler, CancellationToken cancellationToken) =>
        {
            var post = await handler.ExecuteAsync(new GetPostByIdQuery(id), cancellationToken);
            return post is null ? Results.NotFound() : Results.Ok(post);
        })
        .Produces<PostDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        posts.MapPost("/", async (
            UpsertPostRequest request,
            CreatePostHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.ExecuteAsync(
                new UpsertPostCommand(
                    request.Title,
                    request.Excerpt,
                    request.ContentMarkdown,
                    request.CoverImageUrl,
                    request.IsPublished),
                cancellationToken);

            return Results.Created($"/api/posts/{result.Post!.Id}", result.Post);
        })
        .Produces<PostDto>(StatusCodes.Status201Created);

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

            return Results.Ok(result.Post);
        })
        .Produces<PostDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        posts.MapDelete("/{id:guid}", async (
            Guid id,
            DeletePostHandler handler,
            CancellationToken cancellationToken) =>
        {
            var deleted = await handler.ExecuteAsync(new DeletePostCommand(id), cancellationToken);
            return deleted ? Results.NoContent() : Results.NotFound();
        })
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);
    }
}


public sealed record UpsertPostRequest(
    string Title,
    string Excerpt,
    string ContentMarkdown,
    string? CoverImageUrl,
    bool IsPublished);
