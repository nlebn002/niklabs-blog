using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Niklabs.Auth.Application.Abstractions;
using Niklabs.Auth.Domain;
using Niklabs.Auth.Infrastructure.Identity;
using Niklabs.Auth.Infrastructure.Persistence;
using Niklabs.Auth.Infrastructure.Services;

namespace Niklabs.Auth.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAuthInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("postgres")
            ?? configuration["ConnectionStrings__postgres"]
            ?? throw new InvalidOperationException("Connection string 'postgres' is required.");

        services.AddDbContext<AuthDbContext>(options => options.UseNpgsql(
            connectionString,
            npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", AuthDbContext.SchemaName)));

        services
            .AddIdentityCore<AuthUser>(options =>
            {
                options.Password.RequiredLength = 12;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.User.RequireUniqueEmail = true;
            })
            .AddRoles<AuthRole>()
            .AddSignInManager()
            .AddEntityFrameworkStores<AuthDbContext>()
            .AddDefaultTokenProviders();

        services
            .AddAuthentication(IdentityConstants.ApplicationScheme)
            .AddCookie(IdentityConstants.ApplicationScheme, options =>
            {
                options.Cookie.Name = "niklabs.auth";
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                options.LoginPath = "/admin/login";
                options.AccessDeniedPath = "/admin/login";
                options.SlidingExpiration = true;
                options.ExpireTimeSpan = TimeSpan.FromHours(8);
                options.Events = new CookieAuthenticationEvents
                {
                    OnRedirectToLogin = context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        return Task.CompletedTask;
                    },
                    OnRedirectToAccessDenied = context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorizationBuilder()
            .AddPolicy("AdminOnly", policy => policy.RequireRole(AuthRoles.Admin))
            .AddPolicy("CanCreatePosts", policy => policy.RequireRole(AuthRoles.Admin, AuthRoles.User));

        var keysPath = configuration["Auth:DataProtection:KeysPath"]
            ?? Path.Combine(AppContext.BaseDirectory, "data-protection-keys");

        Directory.CreateDirectory(keysPath);
        services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo(keysPath))
            .SetApplicationName("niklabs-blog");

        services.AddScoped<IAuthIdentityGateway, IdentityAuthGateway>();

        return services;
    }
}
