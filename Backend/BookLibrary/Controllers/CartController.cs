using System.Security.Claims;
using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly DatabaseConnection db;

        public CartController(DatabaseConnection db)
        {
            this.db = db;
        }

        [HttpPost("addToCart")]
        [Authorize]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> AddToCart([FromBody] Cart cart)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User claim not found.");

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid user ID format.");

            cart.UserId = userId;

            var book = await db.Books.FirstOrDefaultAsync(b => b.Id == cart.BookId);
            if (book == null)
                return NotFound("Book not found.");

            var existingCartItem = await db.Carts.FirstOrDefaultAsync(c =>
                c.UserId == userId && c.BookId == cart.BookId);

            if (existingCartItem != null)
            {
                // Book is already in cart → Increase quantity
                existingCartItem.TotalItems += cart.TotalItems > 0 ? cart.TotalItems : 1;
                db.Carts.Update(existingCartItem);
            }
            else
            {
                // New cart entry
                cart.CreatedAt = DateTime.UtcNow;
                cart.TotalItems = cart.TotalItems > 0 ? cart.TotalItems : 1;
                await db.Carts.AddAsync(cart);
            }

            await db.SaveChangesAsync();

            return Ok(new { message = "Book added on cart successfully." });
        }

        // Get cart items of the logged-in user
        [HttpGet("getCartItem")]
        [Authorize]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> GetCartItems()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User claim not found.");

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid user ID format.");

            var cartItems = await db.Carts
                .Include(c => c.Book) 
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(cartItems);
        }

        // Remove an item from the cart
        [HttpDelete("delete/{bookId}")]
        [Authorize]
        [Authorize(Policy = "RequireUserRole")]

        public async Task<IActionResult> RemoveFromCart(Guid bookId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User claim not found.");

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid user ID format.");

            var cartItem = await db.Carts.FirstOrDefaultAsync(c =>
                c.UserId == userId && c.BookId == bookId);

            if (cartItem == null)
                return NotFound("Item not found in your cart.");

            db.Carts.Remove(cartItem);
            await db.SaveChangesAsync();

            return Ok(new { message = "Item removed from cart successfully." });
        }

        // Update cart item quantity
        [HttpPatch("update")]
        [Authorize]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> UpdateCartItemQuantity([FromBody] CartUpdateRequest request)
        {
            // Validate quantity
            if (request.Quantity <= 0)
                return BadRequest("Quantity must be greater than zero.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User claim not found.");

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid user ID format.");

            // Check if the item exists in the user's cart
            var cartItem = await db.Carts
                .Include(c => c.Book) // Optional: Include book details
                .FirstOrDefaultAsync(c => c.UserId == userId && c.BookId == request.BookId);

            if (cartItem == null)
                return NotFound("Item not found in your cart.");

            // Update the quantity
            cartItem.TotalItems = request.Quantity;

            // Save changes
            db.Carts.Update(cartItem);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Cart item quantity updated successfully.",
                data = new
                {
                    cartItem.BookId,
                    cartItem.TotalItems,
                    cartItem.CreatedAt,
                    Book = cartItem.Book == null ? null : new
                    {
                        cartItem.Book.Title,
                        cartItem.Book.Author,
                        cartItem.Book.Price
                    }
                }
            });
        }


        // DTO for the request body
        public class CartUpdateRequest
        {
            public Guid BookId { get; set; }
            public int Quantity { get; set; }
        }

    }
}
