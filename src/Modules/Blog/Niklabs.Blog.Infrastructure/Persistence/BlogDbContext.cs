using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Infrastructure.Persistence;

public sealed class BlogDbContext(DbContextOptions<BlogDbContext> options) : DbContext(options), IBlogDbContext
{
    public DbSet<BlogPost> Posts => Set<BlogPost>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.ToTable("posts");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Title).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Excerpt).HasMaxLength(500).IsRequired();
            entity.Property(x => x.ContentMarkdown).IsRequired();
            entity.Property(x => x.CoverImageUrl).HasMaxLength(500);

            entity.HasIndex(x => x.Slug).IsUnique();
        });
    }
}
