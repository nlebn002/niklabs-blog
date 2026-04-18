using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Infrastructure.Persistence;

namespace Niklabs.Blog.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBlogInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("postgres")
            ?? configuration["ConnectionStrings:postgres"]
            ?? configuration["ConnectionStrings__postgres"]
            ?? throw new InvalidOperationException("Connection string 'postgres' is required.");

        services.AddDbContext<BlogDbContext>(options => options.UseNpgsql(connectionString));
        services.AddScoped<IBlogDbContext>(provider => provider.GetRequiredService<BlogDbContext>());

        return services;
    }
}
