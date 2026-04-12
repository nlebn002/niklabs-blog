using Microsoft.Extensions.DependencyInjection;

namespace Niklabs.Blog.Application.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBlogApplication(this IServiceCollection services)
    {
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<Handlers.GetPosts.GetPostsHandler>();
        services.AddScoped<Handlers.GetPostById.GetPostByIdHandler>();
        services.AddScoped<Handlers.CreatePost.CreatePostHandler>();
        services.AddScoped<Handlers.UpdatePost.UpdatePostHandler>();
        services.AddScoped<Handlers.DeletePost.DeletePostHandler>();
        return services;
    }
}
