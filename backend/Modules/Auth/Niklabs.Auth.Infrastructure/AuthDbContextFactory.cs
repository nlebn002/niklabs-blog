using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Niklabs.Auth.Infrastructure.Persistence;

namespace Niklabs.Auth.Infrastructure;

public sealed class AuthDbContextFactory : IDesignTimeDbContextFactory<AuthDbContext>
{
    public AuthDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__postgres")
            ?? "Host=localhost;Port=5432;Database=mydb;Username=admin;Password=admin";

        var options = new DbContextOptionsBuilder<AuthDbContext>()
            .UseNpgsql(
                connectionString,
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", AuthDbContext.SchemaName))
            .Options;

        return new AuthDbContext(options);
    }
}
