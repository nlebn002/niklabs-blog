using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Infrastructure.Persistence;
using Niklabs.Blog.Infrastructure.Storage;

namespace Niklabs.Blog.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBlogInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("blogdb")
            ?? configuration.GetConnectionString("BlogDb")
            ?? throw new InvalidOperationException("Connection string 'blogdb' is required.");

        var storageSection = configuration.GetSection(StorageOptions.SectionName);
        var storageOptions = new StorageOptions
        {
            UploadsPath = storageSection["UploadsPath"] ?? "uploads",
            PublicBasePath = storageSection["PublicBasePath"] ?? "/uploads"
        };

        services.AddDbContext<BlogDbContext>(options => options.UseNpgsql(connectionString));
        services.AddScoped<IBlogDbContext>(provider => provider.GetRequiredService<BlogDbContext>());
        services.AddSingleton(Options.Create(storageOptions));
        services.AddSingleton<IImageStorage, LocalImageStorage>();

        return services;
    }
}
