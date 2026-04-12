using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Niklabs.Blog.Infrastructure.Persistence;

namespace Niklabs.Blog.Infrastructure;

public sealed class BlogDbContextFactory : IDesignTimeDbContextFactory<BlogDbContext>
{
    public BlogDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__postgres")
            ?? "Host=localhost;Port=5432;Database=mydb;Username=admin;Password=admin";

        var options = new DbContextOptionsBuilder<BlogDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new BlogDbContext(options);
    }
}