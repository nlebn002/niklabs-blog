using Microsoft.Extensions.DependencyInjection;

namespace Niklabs.Blog.Application.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBlogApplication(this IServiceCollection services)
    {
        services.AddScoped<Handlers.GetPublishedPosts.GetPublishedPostsHandler>();
        services.AddScoped<Handlers.GetPostBySlug.GetPostBySlugHandler>();
        services.AddScoped<Handlers.GetAdminPosts.GetAdminPostsHandler>();
        services.AddScoped<Handlers.CreatePost.CreatePostHandler>();
        services.AddScoped<Handlers.UpdatePost.UpdatePostHandler>();
        services.AddScoped<Handlers.DeletePost.DeletePostHandler>();
        services.AddScoped<Handlers.UploadImage.UploadImageHandler>();

        return services;
    }
}
