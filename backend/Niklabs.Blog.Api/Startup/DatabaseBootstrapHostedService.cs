using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Niklabs.Auth.Domain;
using Niklabs.Auth.Infrastructure.Identity;
using Niklabs.Auth.Infrastructure.Persistence;
using Niklabs.Blog.Infrastructure.Persistence;
using Npgsql;

namespace Niklabs.Blog.Api.Startup;

public sealed class DatabaseBootstrapHostedService(
    IServiceProvider serviceProvider,
    IConfiguration configuration,
    ILogger<DatabaseBootstrapHostedService> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();

        var authDbContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        var blogDbContext = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AuthUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AuthRole>>();

        var databaseCreated = await IsDatabaseMissingAsync(authDbContext, cancellationToken);
        if (databaseCreated)
        {
            await authDbContext.Database.MigrateAsync(cancellationToken);
            await blogDbContext.Database.MigrateAsync(cancellationToken);

            var databaseName = authDbContext.Database.GetDbConnection().Database;
            logger.LogInformation(
                "Database '{DatabaseName}' was created and all migrations were applied.",
                databaseName);
        }

        var hasAnyUsers = await authDbContext.Users.AnyAsync(cancellationToken);
        if (hasAnyUsers)
        {
            return;
        }

        await CreateBootstrapAdminAsync(userManager, roleManager, cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private static async Task<bool> IsDatabaseMissingAsync(
        AuthDbContext authDbContext,
        CancellationToken cancellationToken)
    {
        try
        {
            await authDbContext.Database.OpenConnectionAsync(cancellationToken);
            await authDbContext.Database.CloseConnectionAsync();
            return false;
        }
        catch (NpgsqlException exception) when (exception.SqlState == PostgresErrorCodes.InvalidCatalogName)
        {
            return true;
        }
    }

    private async Task CreateBootstrapAdminAsync(
        UserManager<AuthUser> userManager,
        RoleManager<AuthRole> roleManager,
        CancellationToken cancellationToken)
    {
        var adminUsername = configuration["Auth:BootstrapAdminUsername"]
            ?? configuration["Auth__BootstrapAdminUsername"];
        var adminEmail = configuration["Auth:BootstrapAdminEmail"]
            ?? configuration["Auth__BootstrapAdminEmail"];
        var adminPassword = configuration["Auth:BootstrapAdminPassword"]
            ?? configuration["Auth__BootstrapAdminPassword"];

        if (string.IsNullOrWhiteSpace(adminUsername))
        {
            throw new InvalidOperationException(
                "Configuration value 'Auth__BootstrapAdminUsername' is required when no users exist.");
        }

        if (string.IsNullOrWhiteSpace(adminEmail))
        {
            throw new InvalidOperationException(
                "Configuration value 'Auth__BootstrapAdminEmail' is required when no users exist.");
        }

        if (string.IsNullOrWhiteSpace(adminPassword))
        {
            throw new InvalidOperationException(
                "Configuration value 'Auth__BootstrapAdminPassword' is required when no users exist.");
        }

        await EnsureRoleExistsAsync(roleManager, AuthRoles.Admin, cancellationToken);
        await EnsureRoleExistsAsync(roleManager, AuthRoles.User, cancellationToken);

        var adminUser = new AuthUser
        {
            Id = Guid.NewGuid(),
            UserName = adminUsername,
            NormalizedUserName = adminUsername.ToUpperInvariant(),
            Email = adminEmail,
            NormalizedEmail = adminEmail.ToUpperInvariant(),
            EmailConfirmed = true,
            IsActive = true
        };

        var createResult = await userManager.CreateAsync(adminUser, adminPassword);
        if (!createResult.Succeeded)
        {
            var errors = string.Join("; ", createResult.Errors.Select(x => x.Description));
            throw new InvalidOperationException($"Failed to create bootstrap admin user: {errors}");
        }

        var addToRoleResult = await userManager.AddToRoleAsync(adminUser, AuthRoles.Admin);
        if (!addToRoleResult.Succeeded)
        {
            var errors = string.Join("; ", addToRoleResult.Errors.Select(x => x.Description));
            throw new InvalidOperationException($"Failed to assign bootstrap admin role: {errors}");
        }

        logger.LogInformation(
            "Bootstrap admin user '{AdminUsername}' was created because no users exist.",
            adminUsername);
    }

    private static async Task EnsureRoleExistsAsync(
        RoleManager<AuthRole> roleManager,
        string roleName,
        CancellationToken cancellationToken)
    {
        if (await roleManager.RoleExistsAsync(roleName))
        {
            return;
        }

        cancellationToken.ThrowIfCancellationRequested();

        var createResult = await roleManager.CreateAsync(new AuthRole
        {
            Id = Guid.NewGuid(),
            Name = roleName,
            NormalizedName = roleName.ToUpperInvariant()
        });

        if (!createResult.Succeeded)
        {
            var errors = string.Join("; ", createResult.Errors.Select(x => x.Description));
            throw new InvalidOperationException($"Failed to create role '{roleName}': {errors}");
        }
    }
}
