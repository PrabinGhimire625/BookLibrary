using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BookLibrary.Data;

namespace BookLibrary.Services
{
    public class BannerCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<BannerCleanupService> _logger;

        public BannerCleanupService(IServiceProvider serviceProvider, ILogger<BannerCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Run every hour (you can change this to a different interval if needed)
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanUpExpiredBanners();
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error during banner cleanup: {ex.Message}");
                }

                // Wait for the next interval (1 hour)
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }

      private async Task CleanUpExpiredBanners()
{
    using (var scope = _serviceProvider.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseConnection>();

        var currentDateTime = DateTime.UtcNow;
        _logger.LogInformation($"[BannerCleanup] Current UTC time: {currentDateTime}");

        var expiredBanners = await dbContext.BannerAnnouncements
            .Where(b => b.EndTime <= currentDateTime)
            .ToListAsync();

        if (expiredBanners.Any())
        {
            foreach (var banner in expiredBanners)
            {
                _logger.LogInformation($"[BannerCleanup] Deleting expired banner: {banner.Title}, EndTime: {banner.EndTime}");
            }

            dbContext.BannerAnnouncements.RemoveRange(expiredBanners);
            await dbContext.SaveChangesAsync();

            _logger.LogInformation($"[BannerCleanup] {expiredBanners.Count} expired banners deleted.");
        }
        else
        {
            _logger.LogInformation("[BannerCleanup] No expired banners found.");
        }
    }
}

    }
}
