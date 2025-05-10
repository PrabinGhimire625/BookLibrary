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

namespace BookLibrary.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly DatabaseConnection db;
        private readonly ILogger<OrderController> _logger;

        public OrderController(DatabaseConnection db, ILogger<OrderController> logger)
        {
            this.db = db;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("place")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> PlaceOrder([FromBody] Order order)
        {
            // Ensure Order and OrderItems are not null or empty
            if (order == null || order.OrderItems == null || !order.OrderItems.Any())
            {
                _logger.LogWarning("Order is null or empty.");
                return BadRequest("Order must contain at least one item.");
            }

            // Ensure phone number and shipping address are provided
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

            // Validate that each BookId in OrderItems exists in Books table
            foreach (var orderItem in order.OrderItems)
            {
                _logger.LogInformation("Checking if Book with ID {BookId} exists in database.", orderItem.BookId);

                var bookExists = await db.Books.AnyAsync(b => b.Id == orderItem.BookId);
                if (!bookExists)
                {
                    _logger.LogWarning("Book with ID {BookId} does not exist.", orderItem.BookId);
                    return BadRequest($"Book with ID {orderItem.BookId} does not exist.");
                }
            }

            // Calculate total price and quantities
            decimal totalPrice = order.OrderItems.Sum(item => item.UnitPrice * item.Quantity);
            int totalBooks = order.OrderItems.Sum(item => item.Quantity);
            decimal discountPercent = 0;

            // Apply 5% discount if total books >= 5
            if (totalBooks >= 5)
            {
                discountPercent += 5;
                _logger.LogInformation("Applied 5% discount for ordering {TotalBooks} books.", totalBooks);
            }

            // Check how many successful orders the user has
            int successfulOrders = await db.Orders.CountAsync(o =>
                o.UserId == order.UserId && o.OrderStatus == OrderStatus.Delivered);

            // Apply additional 10% discount if user has 10 or more successful orders
            if (successfulOrders >= 10)
            {
                discountPercent += 10;
                _logger.LogInformation("Applied 10% loyalty discount for {SuccessfulOrders} successful orders.", successfulOrders);
            }

            // Final total after discounts
            decimal discountedTotal = totalPrice - (totalPrice * discountPercent / 100);
            order.TotalPrice = Math.Round(discountedTotal, 2);
            order.DiscountPercent = discountPercent;

            // Set order meta
            order.OrderStatus = OrderStatus.Pending;
            order.ClaimCode = Guid.NewGuid().ToString("N")[..8].ToUpper(); // Safe & uppercase
                                                                           //send to the register email  
            order.OrderDate = DateTime.UtcNow;

            var orderItems = order.OrderItems.ToList(); // Detach and save separately
            order.OrderItems = null;

            // Save order
            await db.Orders.AddAsync(order);
            await db.SaveChangesAsync();

            // Save order items
            foreach (var item in orderItems)
            {
                item.OrderItemId = Guid.NewGuid();
                item.OrderId = order.OrderId;
                await db.OrderItems.AddAsync(item);
            }

            await db.SaveChangesAsync();

            // Check if order saved properly
            var savedOrder = await db.Orders.AsNoTracking()
                .FirstOrDefaultAsync(o => o.OrderId == order.OrderId);

            if (savedOrder == null)
            {
                _logger.LogError("Order save failed for OrderId: {OrderId}", order.OrderId);
                return StatusCode(500, "Order save failed.");
            }

            // Remove ordered books from the cart
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

            _logger.LogInformation("Order placed successfully for OrderId: {OrderId}", savedOrder.OrderId);

            // Update the order status to Delivered 
            savedOrder.OrderStatus = OrderStatus.Delivered;
            await db.SaveChangesAsync();

            // Save notification once the order is delivered
            var notification = new Notification
            {
                NotificationId = Guid.NewGuid(),
                UserId = savedOrder.UserId,
                Message = $"Your order #{savedOrder.OrderId} has been pending you will find it soon.",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await db.Notifications.AddAsync(notification);
            await db.SaveChangesAsync();

            _logger.LogInformation("Notification created for user: {UserId} regarding delivered order: {OrderId}", savedOrder.UserId, savedOrder.OrderId);

            return Ok(new
            {
                message = "Order placed successfully and notification saved after delivery.",
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


    }
}
