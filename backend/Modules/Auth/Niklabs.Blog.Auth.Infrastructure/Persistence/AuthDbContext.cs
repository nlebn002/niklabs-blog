using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Auth.Infrastructure.Identity;

namespace Niklabs.Blog.Auth.Infrastructure.Persistence;

public sealed class AuthDbContext(DbContextOptions<AuthDbContext> options)
    : IdentityDbContext<AuthUser, AuthRole, Guid>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AuthUser>(entity =>
        {
            entity.Property(x => x.UserName).HasMaxLength(256);
            entity.Property(x => x.Email).HasMaxLength(256);
            entity.Property(x => x.IsActive).HasDefaultValue(true);
        });
    }
}
