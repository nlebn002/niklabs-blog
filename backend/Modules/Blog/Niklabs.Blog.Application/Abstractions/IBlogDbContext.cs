using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Domain.Media;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Abstractions;

public interface IBlogDbContext
{
    DbSet<MediaAsset> MediaAssets { get; }

    DbSet<Post> Posts { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
