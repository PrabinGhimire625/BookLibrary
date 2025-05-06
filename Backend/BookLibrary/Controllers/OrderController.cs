using System.Security.Claims;
using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

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
        
        // Ensure the Book exists in the database
        var bookExists = await db.Books.AnyAsync(b => b.Id == orderItem.BookId);
        
        if (!bookExists)
        {
            _logger.LogWarning("Book with ID {BookId} does not exist.", orderItem.BookId);
            return BadRequest($"Book with ID {orderItem.BookId} does not exist.");
        }
    }

    // Calculate totals
    decimal totalPrice = order.OrderItems.Sum(item => item.UnitPrice * item.Quantity);
    int totalBooks = order.OrderItems.Sum(item => item.Quantity);
    decimal discountPercent = 0;

    // Apply discount for 5 or more books
    if (totalBooks >= 5)
        discountPercent += 5;

    // Apply additional discount for every 10 successful orders
    int successfulOrders = await db.Orders.CountAsync(o =>
        o.UserId == order.UserId && o.OrderStatus == OrderStatus.Delivered);

    if (successfulOrders > 0 && successfulOrders % 10 == 0)
        discountPercent += 10;

    order.TotalPrice = totalPrice - (totalPrice * discountPercent / 100);
    order.DiscountPercent = discountPercent;

    // Explicitly set order status
    order.OrderStatus = OrderStatus.Pending;
    order.ClaimCode = Guid.NewGuid().ToString("N")[..8].ToUpper(); // Safe & uppercase
    order.OrderDate = DateTime.UtcNow;

    var orderItems = order.OrderItems.ToList(); // Detach items to save them separately
    order.OrderItems = null;

    // Save Order to database
    await db.Orders.AddAsync(order);
    await db.SaveChangesAsync();

    // Save OrderItems separately
    foreach (var item in orderItems)
    {
        item.OrderItemId = Guid.NewGuid();
        item.OrderId = order.OrderId;
        await db.OrderItems.AddAsync(item);
    }

    await db.SaveChangesAsync();

    // Double-check saved status
    var savedOrder = await db.Orders.AsNoTracking()
        .FirstOrDefaultAsync(o => o.OrderId == order.OrderId);

    if (savedOrder == null)
    {
        _logger.LogError("Order save failed for OrderId: {OrderId}", order.OrderId);
        return StatusCode(500, "Order save failed.");
    }

    _logger.LogInformation("Order placed successfully for OrderId: {OrderId}", savedOrder.OrderId);

    return Ok(new
    {
        message = "Order placed successfully",
        orderId = savedOrder.OrderId,
        claimCode = savedOrder.ClaimCode,
        status = savedOrder.OrderStatus.ToString()
    });
}
    }
}
