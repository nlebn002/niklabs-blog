using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Infrastructure.Persistence;

public sealed class BlogDbContext(DbContextOptions<BlogDbContext> options) : DbContext(options), IBlogDbContext
{
    public DbSet<Post> Posts => Set<Post>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.AuthorUserId).IsRequired();
            entity.Property(x => x.Title).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Excerpt).HasMaxLength(500).IsRequired();
            entity.Property(x => x.ContentMarkdown).IsRequired();
            entity.Property(x => x.CoverImageUrl).HasMaxLength(500);
            entity.HasIndex(x => x.AuthorUserId);
        });
    }
}
