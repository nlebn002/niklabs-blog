using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Minio;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Infrastructure.Persistence;
using Niklabs.Blog.Infrastructure.Storage;

namespace Niklabs.Blog.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBlogInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("postgres")
            ?? configuration["ConnectionStrings__postgres"]
            ?? throw new InvalidOperationException("Connection string 'postgres' is required.");

        services.AddDbContext<BlogDbContext>(options => options.UseNpgsql(
            connectionString,
            npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", BlogDbContext.SchemaName)));
        services.AddScoped<IBlogDbContext>(provider => provider.GetRequiredService<BlogDbContext>());
        services
            .AddOptions<ObjectStorageOptions>()
            .Bind(configuration.GetSection(ObjectStorageOptions.SectionName))
            .Validate(static options => !string.IsNullOrWhiteSpace(options.Endpoint), "ObjectStorage:Endpoint is required.")
            .Validate(static options => !string.IsNullOrWhiteSpace(options.AccessKey), "ObjectStorage:AccessKey is required.")
            .Validate(static options => !string.IsNullOrWhiteSpace(options.SecretKey), "ObjectStorage:SecretKey is required.")
            .Validate(static options => !string.IsNullOrWhiteSpace(options.Bucket), "ObjectStorage:Bucket is required.")
            .Validate(static options => !string.IsNullOrWhiteSpace(options.PublicBaseUrl), "ObjectStorage:PublicBaseUrl is required.")
            .ValidateOnStart();
        services.AddSingleton<IMinioClient>(provider =>
        {
            var options = provider.GetRequiredService<IOptions<ObjectStorageOptions>>().Value;
            return new MinioClient()
                .WithEndpoint(options.Endpoint)
                .WithCredentials(options.AccessKey, options.SecretKey)
                .WithSSL(options.UseSsl)
                .Build();
        });
        services.AddScoped<IObjectStorage, MinioObjectStorage>();

        return services;
    }
}
