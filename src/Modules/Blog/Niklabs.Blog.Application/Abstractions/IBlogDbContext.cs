using Microsoft.EntityFrameworkCore;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Abstractions;

public interface IBlogDbContext
{
    DbSet<BlogPost> Posts { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
