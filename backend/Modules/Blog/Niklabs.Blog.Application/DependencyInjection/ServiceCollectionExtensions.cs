using Microsoft.Extensions.DependencyInjection;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.Services;

namespace Niklabs.Blog.Application.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBlogApplication(this IServiceCollection services)
    {
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<IPostAuthorizationService, PostAuthorizationService>();
        services.AddScoped<IPostContentProjectionService, LexicalContentProjectionService>();
        services.AddScoped<Handlers.GetPosts.GetPostsHandler>();
        services.AddScoped<Handlers.GetPostById.GetPostByIdHandler>();
        services.AddScoped<Handlers.CreatePost.CreatePostHandler>();
        services.AddScoped<Handlers.UpdatePost.UpdatePostHandler>();
        services.AddScoped<Handlers.DeletePost.DeletePostHandler>();
        return services;
    }
}
