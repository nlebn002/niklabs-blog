using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Domain.Media;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Infrastructure.Persistence;

public sealed class BlogDbContext(DbContextOptions<BlogDbContext> options) : DbContext(options), IBlogDbContext
{
    public const string SchemaName = "post";

    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<Post> Posts => Set<Post>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(SchemaName);

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

        modelBuilder.Entity<MediaAsset>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.UploadedByUserId).IsRequired();
            entity.Property(x => x.ObjectKey).HasMaxLength(512).IsRequired();
            entity.Property(x => x.OriginalFileName).HasMaxLength(255).IsRequired();
            entity.Property(x => x.ContentType).HasMaxLength(128).IsRequired();
            entity.Property(x => x.SizeBytes).IsRequired();
            entity.Property(x => x.Width).IsRequired();
            entity.Property(x => x.Height).IsRequired();
            entity.Property(x => x.AltText).HasMaxLength(300);
            entity.Property(x => x.Kind).HasConversion<string>().HasMaxLength(32).IsRequired();
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UpdatedAtUtc).IsRequired();
            entity.HasIndex(x => x.PostId);
            entity.HasIndex(x => x.ObjectKey).IsUnique();
            entity.HasIndex(x => x.UploadedByUserId);
            entity.HasOne(x => x.Post)
                .WithMany()
                .HasForeignKey(x => x.PostId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
