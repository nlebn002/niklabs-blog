using Microsoft.AspNetCore.Authorization;

namespace Niklabs.Blog.Api.Endpoints.Posts;

public static class PostEndpoints
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        var posts = endpoints.MapGroup("/api/posts").WithTags("Blog");

        posts.MapGetPostsEndpoint();
        posts.MapGetPostByIdEndpoint();
        posts.MapCreatePostEndpoint();
        posts.MapUpdatePostEndpoint();
        posts.MapDeletePostEndpoint();
    }
}
