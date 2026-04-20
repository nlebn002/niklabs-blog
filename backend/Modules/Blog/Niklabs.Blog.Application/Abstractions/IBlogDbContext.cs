using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Domain.Media;
using Niklabs.Blog.Domain.Posts;
using Niklabs.Blog.Domain.Tags;

namespace Niklabs.Blog.Application.Abstractions;

public interface IBlogDbContext
{
    DbSet<MediaAsset> MediaAssets { get; }

    DbSet<Post> Posts { get; }

    DbSet<PostTag> PostTags { get; }

    DbSet<Tag> Tags { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
