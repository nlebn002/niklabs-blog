using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Domain.Media;
using Niklabs.Blog.Domain.Posts;
using Niklabs.Blog.Domain.Tags;

namespace Niklabs.Blog.Infrastructure.Persistence;

public sealed class BlogDbContext(DbContextOptions<BlogDbContext> options) : DbContext(options), IBlogDbContext
{
    public const string SchemaName = "post";

    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<PostTag> PostTags => Set<PostTag>();
    public DbSet<Tag> Tags => Set<Tag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(SchemaName);

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.AuthorUserId).IsRequired();
            entity.Property(x => x.Title).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Excerpt).HasMaxLength(500).IsRequired();
            entity.Property(x => x.ContentJson).IsRequired();
            entity.Property(x => x.ContentHtml).IsRequired();
            entity.Property(x => x.ContentText).IsRequired();
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
            entity.Property(x => x.SeoTitle).HasMaxLength(180);
            entity.Property(x => x.SeoDescription).HasMaxLength(320);
            entity.HasIndex(x => x.AuthorUserId);
            entity.HasIndex(x => x.Slug).IsUnique();
            entity.HasIndex(x => x.CoverImageMediaAssetId);
            entity.HasOne(x => x.CoverImageMediaAsset)
                .WithMany()
                .HasForeignKey(x => x.CoverImageMediaAssetId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).HasMaxLength(80).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(96).IsRequired();
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.Property(x => x.UpdatedAtUtc).IsRequired();
            entity.HasIndex(x => x.Name).IsUnique();
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        modelBuilder.Entity<PostTag>(entity =>
        {
            entity.HasKey(x => new { x.PostId, x.TagId });
            entity.Property(x => x.CreatedAtUtc).IsRequired();
            entity.HasIndex(x => x.TagId);
            entity.HasOne(x => x.Post)
                .WithMany(x => x.PostTags)
                .HasForeignKey(x => x.PostId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Tag)
                .WithMany(x => x.PostTags)
                .HasForeignKey(x => x.TagId)
                .OnDelete(DeleteBehavior.Cascade);
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
