using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;
using BookLibrary.Data;
using Microsoft.EntityFrameworkCore;

public class DiscountCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public DiscountCleanupService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<DatabaseConnection>();
                var now = DateTime.UtcNow;

                var expiredDiscounts = await db.Books
                    .Where(b => b.IsOnSale && b.DiscountEndDate != null && b.DiscountEndDate <= now)
                    .ToListAsync(stoppingToken);

                foreach (var book in expiredDiscounts)
                {
                    book.IsOnSale = false;
                    book.DiscountPercentage = 0;
                    book.DiscountStartDate = null;
                    book.DiscountEndDate = null;
                }

                if (expiredDiscounts.Any())
                {
                    await db.SaveChangesAsync(stoppingToken);
                }
            }

            // Wait 1 hour before checking again
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}
