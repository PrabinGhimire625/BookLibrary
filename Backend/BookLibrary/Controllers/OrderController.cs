using System.Security.Claims;
using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;
using BookLibrary.DTOs.Request;
using BookLibrary.Services.Email;

namespace BookLibrary.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly DatabaseConnection db;
        private readonly ILogger<OrderController> _logger;
        private readonly EmailService emailService;

        public OrderController(DatabaseConnection db, ILogger<OrderController> logger, EmailService emailService)
        {
            this.db = db;
            this.emailService = emailService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("place")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> PlaceOrder([FromBody] Order order)
        {
            if (order == null || order.OrderItems == null || !order.OrderItems.Any())
            {
                _logger.LogWarning("Order is null or empty.");
                return BadRequest("Order must contain at least one item.");
            }

            if (string.IsNullOrWhiteSpace(order.PhoneNumber) || string.IsNullOrWhiteSpace(order.ShippingAddress))
            {
                _logger.LogWarning("Phone number or shipping address is missing.");
                return BadRequest("Phone number and shipping address are required.");
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            order.UserId = Guid.Parse(userId);

            foreach (var orderItem in order.OrderItems)
            {
                var bookExists = await db.Books.AnyAsync(b => b.Id == orderItem.BookId);
                if (!bookExists)
                {
                    _logger.LogWarning("Book with ID {BookId} does not exist.", orderItem.BookId);
                    return BadRequest($"Book with ID {orderItem.BookId} does not exist.");
                }
            }

            decimal totalPrice = order.OrderItems.Sum(item => item.UnitPrice * item.Quantity);
            int totalBooks = order.OrderItems.Sum(item => item.Quantity);
            decimal discountPercent = 0;

            if (totalBooks >= 5)
            {
                discountPercent += 5;
                _logger.LogInformation("Applied 5% discount for ordering {TotalBooks} books.", totalBooks);
            }

            int successfulOrders = await db.Orders.CountAsync(o =>
                o.UserId == order.UserId && o.OrderStatus == OrderStatus.Delivered);

            if (successfulOrders >= 10)
            {
                discountPercent += 10;
                _logger.LogInformation("Applied 10% loyalty discount for {SuccessfulOrders} successful orders.", successfulOrders);
            }

            decimal discountedTotal = totalPrice - (totalPrice * discountPercent / 100);
            order.TotalPrice = Math.Round(discountedTotal, 2);
            order.DiscountPercent = discountPercent;
            order.OrderStatus = OrderStatus.Pending;
            order.ClaimCode = Guid.NewGuid().ToString("N")[..8].ToUpper();
            order.OrderDate = DateTime.UtcNow;

            var orderItems = order.OrderItems.ToList(); // Detach for later use
            order.OrderItems = null;

            await db.Orders.AddAsync(order);
            await db.SaveChangesAsync();

            foreach (var item in orderItems)
            {
                item.OrderItemId = Guid.NewGuid();
                item.OrderId = order.OrderId;
                await db.OrderItems.AddAsync(item);
            }
            await db.SaveChangesAsync();

            // Remove ordered books from cart
            var bookIds = orderItems.Select(oi => oi.BookId).ToList();
            var cartItemsToRemove = await db.Carts
                .Where(c => c.UserId == order.UserId && bookIds.Contains(c.BookId))
                .ToListAsync();

            if (cartItemsToRemove.Any())
            {
                db.Carts.RemoveRange(cartItemsToRemove);
                await db.SaveChangesAsync();
                _logger.LogInformation("Removed {Count} items from cart after order.", cartItemsToRemove.Count);
            }

            // Retrieve saved order
            var savedOrder = await db.Orders.FirstOrDefaultAsync(o => o.OrderId == order.OrderId);
            if (savedOrder == null)
            {
                _logger.LogError("Order save failed for OrderId: {OrderId}", order.OrderId);
                return StatusCode(500, "Order save failed.");
            }

            // Set order status to Delivered
            savedOrder.OrderStatus = OrderStatus.Pending;
            await db.SaveChangesAsync();

            // Add notification
            var notification = new Notification
            {
                NotificationId = Guid.NewGuid(),
                UserId = savedOrder.UserId,
                Message = $"Your order #{savedOrder.OrderId} has been pending. You will find it soon.",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await db.Notifications.AddAsync(notification);
            await db.SaveChangesAsync();

            _logger.LogInformation("Notification created for user: {UserId} regarding order: {OrderId}", savedOrder.UserId, savedOrder.OrderId);

            // Send email to user
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (!string.IsNullOrWhiteSpace(userEmail))
                try
                {
                    string subject = "Order Confirmation - BookLibrary";
                    string body = $@"
    <div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:10px;'>
        <h2 style='color:#4CAF50;'>📚 BookLibrary - Order Confirmation</h2>
        <p><strong>Hi Member,</strong></p>
        <p>Thank you for your purchase! Your order has been placed successfully. Below are the details:</p>

        <h3>📄 Order Summary</h3>
        <p><strong>Order ID:</strong> {savedOrder.OrderId}</p>
        <p><strong>Claim Code:</strong> {savedOrder.ClaimCode}</p>
        <p><strong>Status:</strong> {savedOrder.OrderStatus}</p>
        <p><strong>Order Date:</strong> {savedOrder.OrderDate:dd MMM yyyy}</p>

        <h3>📦 Shipping Info</h3>
        <p><strong>Phone:</strong> {order.PhoneNumber}</p>
        <p><strong>Address:</strong> {order.ShippingAddress}</p>

        <h3>🛒 Items Ordered</h3>
        <table style='width:100%;border-collapse:collapse;'>
            <thead>
                <tr style='background:#f2f2f2;'>
                    <th style='border:1px solid #ddd;padding:8px;text-align:left;'>Book</th>
                    <th style='border:1px solid #ddd;padding:8px;text-align:right;'>Qty</th>
                    <th style='border:1px solid #ddd;padding:8px;text-align:right;'>Price</th>
                </tr>
            </thead>
            <tbody>";

                    foreach (var item in orderItems)
                    {
                        var book = await db.Books.FindAsync(item.BookId);
                        body += $@"
        <tr>
            <td style='border:1px solid #ddd;padding:8px;'>{book?.Title}</td>
            <td style='border:1px solid #ddd;padding:8px;text-align:right;'>{item.Quantity}</td>
            <td style='border:1px solid #ddd;padding:8px;text-align:right;'>Rs.{item.UnitPrice * item.Quantity:F2}</td>
        </tr>";
                    }

                    body += $@"
            </tbody>
        </table>

        <h3>💰 Billing Summary</h3>
        <p><strong>Discount Applied:</strong> {discountPercent}%</p>
        <p><strong>Total:</strong> <span style='color:#4CAF50;font-size:18px;'>Rs.{savedOrder.TotalPrice:F2}</span></p>

        <p style='margin-top:20px;'>If you have any questions, feel free to reply to this email.</p>
        <p style='color:#888;'>— BookLibrary Team</p>
    </div>";

                    await emailService.SendEmailAsync(userEmail, subject, body);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send confirmation email for order {OrderId}", savedOrder.OrderId);
                    // You may choose to continue or return a warning response
                }

            return Ok(new
            {
                message = "Order placed successfully and notification sent.",
                orderId = savedOrder.OrderId,
                claimCode = savedOrder.ClaimCode,
                status = savedOrder.OrderStatus.ToString(),
                discountApplied = discountPercent,
                totalPrice = savedOrder.TotalPrice
            });
        }

        //get all the orders
        [Authorize]
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await db.Orders.ToListAsync();

            if (orders == null || !orders.Any())
            {
                return NotFound("No orders found.");
            }
            return Ok(orders);
        }


        // get the pending order only
        [Authorize]
        [HttpGet("pending")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> GetPendingOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                _logger.LogWarning("Unauthorized access attempt to fetch pending orders.");
                return Unauthorized();
            }

            var parsedUserId = Guid.Parse(userId);

            var pendingOrders = await db.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .Where(o => o.UserId == parsedUserId && o.OrderStatus == OrderStatus.Pending)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            if (!pendingOrders.Any())
            {
                return NotFound("No pending orders found.");
            }

            var result = pendingOrders.Select(o => new PendingOrderDto
            {
                OrderId = o.OrderId,
                OrderDate = o.OrderDate,
                TotalPrice = o.TotalPrice.ToString(),
                Status = o.OrderStatus.ToString(),
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    BookTitle = oi.Book.Title,
                    CoverImage = oi.Book.CoverImage,
                    Genre = oi.Book.Genre,
                    Category = oi.Book.Category,
                    Quantity = oi.Quantity,
                    PricePerUnit = oi.UnitPrice
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        //get the already delivered order
        [Authorize]
        [HttpGet("delivered")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> GetDeliveredOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                _logger.LogWarning("Unauthorized access attempt to fetch delivered orders.");
                return Unauthorized();
            }

            var parsedUserId = Guid.Parse(userId);

            // Fetch the delivered orders along with the necessary Book details
            var deliveredOrders = await db.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .Where(o => o.UserId == parsedUserId && o.OrderStatus == OrderStatus.Delivered)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            if (!deliveredOrders.Any())
            {
                return NotFound("No delivered orders found.");
            }

            var result = deliveredOrders.Select(o => new PendingOrderDto
            {
                OrderId = o.OrderId,
                OrderDate = o.OrderDate,
                TotalPrice = o.TotalPrice.ToString(),
                Status = o.OrderStatus.ToString(),
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    BookTitle = oi.Book.Title,
                    Quantity = oi.Quantity,
                    PricePerUnit = oi.UnitPrice,
                    CoverImage = oi.Book.CoverImage,
                    Genre = oi.Book.Genre,
                    Category = oi.Book.Category
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        //cancle the order
        [Authorize]
        [HttpPatch("cancel/{orderId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> CancelOrder(Guid orderId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                _logger.LogWarning("Unauthorized access attempt to cancel order.");
                return Unauthorized();
            }

            var parsedUserId = Guid.Parse(userId);

            var order = await db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == parsedUserId);

            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found or does not belong to user.", orderId);
                return NotFound("Order not found or you do not have permission to cancel it.");
            }

            if (order.OrderStatus != OrderStatus.Pending)
            {
                _logger.LogWarning("Attempt to cancel a non-pending order with ID {OrderId}.", orderId);
                return BadRequest("Only pending orders can be cancelled.");
            }

            // Update the status to Cancelled
            order.OrderStatus = OrderStatus.Cancelled;
            await db.SaveChangesAsync();

            _logger.LogInformation("Order with ID {OrderId} was successfully cancelled.", orderId);

            return Ok(new
            {
                message = "Order has been cancelled successfully.",
                orderId = order.OrderId,
                status = order.OrderStatus.ToString()
            });
        }

        //get all the cancel order
        [Authorize]
        [HttpGet("cancelled")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> GetCancelledOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                _logger.LogWarning("Unauthorized access attempt to fetch cancelled orders.");
                return Unauthorized();
            }

            var parsedUserId = Guid.Parse(userId);

            // Fetch cancelled orders for the current user
            var cancelledOrders = await db.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .Where(o => o.UserId == parsedUserId && o.OrderStatus == OrderStatus.Cancelled)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            if (!cancelledOrders.Any())
            {
                return NotFound("No cancelled orders found.");
            }

            var result = cancelledOrders.Select(o => new PendingOrderDto
            {
                OrderId = o.OrderId,
                OrderDate = o.OrderDate,
                Status = o.OrderStatus.ToString(),
                TotalPrice = o.TotalPrice.ToString(),
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    BookTitle = oi.Book.Title,
                    CoverImage = oi.Book.CoverImage,
                    Genre = oi.Book.Genre,
                    Category = oi.Book.Category,
                    Quantity = oi.Quantity,
                    PricePerUnit = oi.UnitPrice
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        //get the sing order details
        [Authorize]
        [HttpGet("{orderId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> GetSingleOrder(Guid orderId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                _logger.LogWarning("Unauthorized access attempt to fetch order.");
                return Unauthorized();
            }

            var parsedUserId = Guid.Parse(userId);

            var order = await db.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == parsedUserId);

            if (order == null)
            {
                return NotFound("Order not found or you do not have permission to view it.");
            }

            var result = new PendingOrderDto
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                TotalPrice = order.TotalPrice.ToString(),

                Status = order.OrderStatus.ToString(),

                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    BookTitle = oi.Book.Title,
                    BookId = oi.Book.Id,
                    CoverImage = oi.Book.CoverImage,
                    Genre = oi.Book.Genre,
                    Category = oi.Book.Category,
                    Quantity = oi.Quantity,
                    PricePerUnit = oi.UnitPrice
                }).ToList()
            };

            return Ok(result);
        }

        // staffy verify the claim code and change the status to delivered
        [HttpPost("staff/validation/{orderId}/{code}")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<IActionResult> ValidateClaimCode(Guid orderId, string code)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (currentUserId == null)
                return Unauthorized("User is not logged in.");

            var order = await db.Orders
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
                return NotFound("Order not found.");

            if (order.ClaimCode != code.ToUpper())
                return BadRequest("Invalid claim code.");

            if (order.OrderStatus == OrderStatus.Delivered)
                return BadRequest("Order already delivered.");

            order.OrderStatus = OrderStatus.Delivered;
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Claim code validated successfully by staff.",
                orderId = order.OrderId,
                status = order.OrderStatus.ToString()
            });
        }
        
    }
}
