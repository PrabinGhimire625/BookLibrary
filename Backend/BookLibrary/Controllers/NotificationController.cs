using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookLibrary.Controllers
{
    [Route("api/notification")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly DatabaseConnection db;

        public NotificationController(DatabaseConnection db)
        {
            this.db = db;
        }

        // GET notification
        [HttpGet]
        public async Task<IActionResult> GetNotificationsForUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("Invalid or missing user ID in token.");
            }

            var notifications = await db.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            if (notifications == null || !notifications.Any())
            {
                return NotFound("No notifications found for the user.");
            }

            return Ok(notifications);
        }


        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllNotificationsAsRead()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("Invalid or missing user ID in token.");
            }

            // Get all notifications for the user that are not already read
            var notifications = await db.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            if (notifications == null || !notifications.Any())
            {
                return NotFound("No unread notifications found for the user.");
            }

            // Update all unread notifications to read
            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await db.SaveChangesAsync();

            return Ok("All notifications marked as read.");
        }

        // GET unread notifications
        [HttpGet("unread")]
        public async Task<IActionResult> GetUnreadNotificationsForUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized("Invalid or missing user ID in token.");
            }

            var unreadNotifications = await db.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            if (!unreadNotifications.Any())
            {
                return NotFound("No unread notifications found for the user.");
            }

            return Ok(unreadNotifications);
        }


    }
}
