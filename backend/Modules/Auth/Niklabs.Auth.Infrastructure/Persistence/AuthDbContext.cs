using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Niklabs.Auth.Infrastructure.Identity;

namespace Niklabs.Auth.Infrastructure.Persistence;

public sealed class AuthDbContext(DbContextOptions<AuthDbContext> options)
    : IdentityDbContext<AuthUser, AuthRole, Guid>(options)
{
    public const string SchemaName = "auth";

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasDefaultSchema(SchemaName);

        base.OnModelCreating(builder);

        builder.Entity<AuthUser>(entity =>
        {
            entity.Property(x => x.UserName).HasMaxLength(256);
            entity.Property(x => x.Email).HasMaxLength(256);
            entity.Property(x => x.IsActive).HasDefaultValue(true);
        });
    }
}
