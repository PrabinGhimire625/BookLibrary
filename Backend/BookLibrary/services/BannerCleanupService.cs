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
    // Background service that periodically cleans up expired banner announcements from the database.
    public class BannerCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider; // Provides scoped access to services like DbContext
        private readonly ILogger<BannerCleanupService> _logger; // Used for logging information and errors

        // Constructor to inject service provider and logger
        public BannerCleanupService(IServiceProvider serviceProvider, ILogger<BannerCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        // This method is automatically called when the service starts.
        // It runs in a loop until the service is stopped.
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Run cleanup every hour until cancellation is requested
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Perform the banner cleanup logic
                    await CleanUpExpiredBanners();
                }
                catch (Exception ex)
                {
                    // Log any exception that occurs during the cleanup process
                    _logger.LogError($"Error during banner cleanup: {ex.Message}");
                }

                // Wait for 1 hour before executing again
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }

        // Method that performs the actual cleanup of expired banners
        private async Task CleanUpExpiredBanners()
        {
            // Create a new scope to retrieve a scoped DbContext instance
            using (var scope = _serviceProvider.CreateScope())
            {
                // Get the database context
                var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseConnection>();

                var currentDateTime = DateTime.UtcNow;
                _logger.LogInformation($"[BannerCleanup] Current UTC time: {currentDateTime}");

                // Find all banners whose EndTime is less than or equal to the current UTC time
                var expiredBanners = await dbContext.BannerAnnouncements
                    .Where(b => b.EndTime <= currentDateTime)
                    .ToListAsync();

                // If there are expired banners, delete them and log the process
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
                    // Log if no expired banners are found
                    _logger.LogInformation("[BannerCleanup] No expired banners found.");
                }
            }
        }
    }
}
