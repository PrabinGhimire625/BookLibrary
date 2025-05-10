using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BookLibrary.Model;
using BookLibrary.Data;
using BookLibrary.Dto;
using System.Security.Claims;

namespace BookLibrary.Controllers
{
    [Route("api/staff")]
    [ApiController]
    [Authorize(Policy = "RequireStaffRole")]
    public class StaffController : ControllerBase
    {
        private readonly DatabaseConnection db;

        public StaffController(DatabaseConnection db)
        {
            this.db = db;
        }

        //change the order status by the staff
        [HttpPatch("changeStatus/{orderId}")]
        public async Task<IActionResult> ChangeOrderStatusToDelivered(Guid orderId)
        {
            var order = await db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
            {
                return NotFound($"Order with ID {orderId} not found.");
            }

            // Check if the current status is not already 'Delivered'
            if (order.OrderStatus == OrderStatus.Delivered)
            {
                return BadRequest($"Order with ID {orderId} is already delivered.");
            }

            // Change the order status to Delivered
            order.OrderStatus = OrderStatus.Delivered;
            db.Orders.Update(order);
            await db.SaveChangesAsync();
            var userId = order.UserId;

            var notification = new Notification
            {
                NotificationId = Guid.NewGuid(),
                UserId = userId,
                Message = $"Your order #{order.ClaimCode} has been delivered.",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            // Save the notification
            await db.Notifications.AddAsync(notification);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Order status updated to Delivered.",
                orderId = order.OrderId,
                claimCode = order.ClaimCode,
                status = order.OrderStatus.ToString()
            });
        }
    }

}