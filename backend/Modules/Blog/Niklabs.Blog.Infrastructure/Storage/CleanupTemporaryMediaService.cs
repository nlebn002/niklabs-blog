using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Domain.Media;
using Niklabs.Blog.Infrastructure.Persistence;

namespace Niklabs.Blog.Infrastructure.Storage;

internal sealed class CleanupTemporaryMediaService(
    IServiceScopeFactory scopeFactory,
    ILogger<CleanupTemporaryMediaService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromHours(1));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await CleanupAsync(stoppingToken);
        }
    }

    private async Task CleanupAsync(CancellationToken ct)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
        var storage = scope.ServiceProvider.GetRequiredService<IObjectStorage>();

        var cutoff = DateTimeOffset.UtcNow.AddHours(-24);
        var stale = await db.MediaAssets
            .Where(a => a.Status == MediaAssetStatus.Temporary && a.CreatedAtUtc < cutoff)
            .ToListAsync(ct);

        foreach (var asset in stale)
        {
            try
            {
                await storage.DeleteAsync(asset.ObjectKey, ct);
                db.MediaAssets.Remove(asset);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to clean up temp asset {Id}", asset.Id);
            }
        }

        if (stale.Count > 0)
        {
            await db.SaveChangesAsync(ct);
        }
    }
}
