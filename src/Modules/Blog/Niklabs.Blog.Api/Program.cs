using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Niklabs.Blog.Api.EndpointMappings;
using Niklabs.Blog.Application.DependencyInjection;
using Niklabs.Blog.Infrastructure.DependencyInjection;
using Niklabs.Blog.Infrastructure.Persistence;
using Niklabs.Blog.Infrastructure.Storage;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddOpenApi();
builder.Services.AddBlogApplication();
builder.Services.AddBlogInfrastructure(builder.Configuration);
builder.Services.Configure<FormOptions>(options => options.MultipartBodyLengthLimit = 10 * 1024 * 1024);

var app = builder.Build();

await ApplyMigrationsAsync<BlogDbContext>(app.Services);

var storageOptions = app.Services.GetRequiredService<Microsoft.Extensions.Options.IOptions<StorageOptions>>().Value;
var uploadsPath = Path.GetFullPath(storageOptions.UploadsPath);
Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = storageOptions.PublicBasePath
});

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapGet("/", () => Results.Redirect("/scalar/v1"));
app.MapBlogEndpoints();

app.Run();

static async Task ApplyMigrationsAsync<TDbContext>(IServiceProvider services)
    where TDbContext : DbContext
{
    await using var scope = services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<TDbContext>();
    await dbContext.Database.MigrateAsync();
}
