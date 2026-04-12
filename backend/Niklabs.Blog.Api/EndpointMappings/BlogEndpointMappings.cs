using Niklabs.Blog.Api.EndpointFilters;
using Niklabs.Blog.Api.Endpoints;

namespace Niklabs.Blog.Api.EndpointMappings;

public static class BlogEndpointMappings
{
    public static IEndpointRouteBuilder MapBlogEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var posts = endpoints.MapGroup("/api/posts").WithTags("Posts");
        GetPublishedPostsEndpoint.Map(posts);
        GetPostBySlugEndpoint.Map(posts);

        var admin = endpoints.MapGroup("/api/admin").WithTags("Admin");
        admin.AddEndpointFilter<AdminApiKeyFilter>();
        GetAdminPostsEndpoint.Map(admin);
        CreatePostEndpoint.Map(admin);
        UpdatePostEndpoint.Map(admin);
        DeletePostEndpoint.Map(admin);
        UploadImageEndpoint.Map(admin);

        return endpoints;
    }
}
