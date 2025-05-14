using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/book")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly DatabaseConnection db;

        public BookController(DatabaseConnection db)
        {
            this.db = db;
        }

        // Add the book to the database
        [HttpPost("add")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> PostBook([FromBody] Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = ModelState });
            }

            if (await db.Books.AnyAsync(b => b.Title == book.Title))
            {
                return Conflict(new { error = "Book with this title already exists." });
            }

            // AddedDate and PublicationDate are in UTC
            book.AddedDate = book.AddedDate.Kind == DateTimeKind.Utc ? book.AddedDate : book.AddedDate.ToUniversalTime();
            book.PublicationDate = book.PublicationDate.Kind == DateTimeKind.Utc ? book.PublicationDate : book.PublicationDate.ToUniversalTime();

            // Price is a positive value
            if (book.Price <= 0)
            {
                return BadRequest(new { error = "Price must be a positive value." });
            }

            await db.Books.AddAsync(book);
            await db.SaveChangesAsync();

            return Ok(new { data = book });
        }


        [HttpGet("getAllBook")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await db.Books
                .OrderByDescending(book => book.AddedDate) // Sort by latest added date
                .ToListAsync();

            var bookResponses = books.Select(book => new
            {
                book.Id,
                book.Title,
                book.ISBN,
                book.Author,
                book.AddedDate,
                book.PublicationDate,
                book.Price,  // Original price
                currentPrice = book.GetCurrentPrice(),  // Computed discounted price
                book.Genre,
                book.Category,
                book.Description,
                book.CoverImage,
                book.IsOnSale,
                book.DiscountPercentage,
                book.DiscountStartDate,
                book.DiscountEndDate,
                book.Stock
            }).ToList();

            return Ok(new { data = bookResponses });
        }

        // Get a single book by ID
        [HttpGet("singleBook/{id}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            var book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { error = "Book not found." });
            }
            // Return full book details along with computed currentPrice
            var bookResponse = new
            {
                book.Id,
                book.Title,
                book.ISBN,
                book.Author,
                book.AddedDate,
                book.PublicationDate,
                book.Price,  // Original price
                currentPrice = book.GetCurrentPrice(),  // Computed discounted price
                book.Genre,
                book.Category,
                book.Description,
                book.CoverImage,
                book.IsOnSale,
                book.DiscountPercentage,
                book.DiscountStartDate,
                book.DiscountEndDate,
                book.Stock
            };

            return Ok(new { data = bookResponse });
        }


        // Update a book
        [HttpPatch("update/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromBody] Book updatedBook)
        {
            var existingBook = await db.Books.FindAsync(id);
            if (existingBook == null)
            {
                return NotFound(new { error = "Book not found." });
            }
            existingBook.Title = updatedBook.Title;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Author = updatedBook.Author;
            existingBook.IsOnSale = updatedBook.IsOnSale;
            existingBook.Price = updatedBook.Price;
            existingBook.CoverImage = updatedBook.CoverImage;
            existingBook.Genre = updatedBook.Genre;
            existingBook.Category = updatedBook.Category;
            existingBook.AddedDate = existingBook.AddedDate.Kind == DateTimeKind.Utc ? existingBook.AddedDate : existingBook.AddedDate.ToUniversalTime();
            existingBook.PublicationDate = existingBook.PublicationDate.Kind == DateTimeKind.Utc ? existingBook.PublicationDate : existingBook.PublicationDate.ToUniversalTime();
            existingBook.Description = updatedBook.Description;
            existingBook.Stock = updatedBook.Stock;
            await db.SaveChangesAsync();
            return Ok(new { data = existingBook });
        }

        // Delete a book
        [HttpDelete("delete/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            var book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { error = "Book not found." });
            }

            db.Books.Remove(book);
            await db.SaveChangesAsync();

            return Ok(new { data = "Book deleted successfully." });
        }

        // Search books by title, ISBN, or description
        [HttpGet("search")]
        public async Task<IActionResult> SearchBooks([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { error = "Search query is required." });
            }

            var lowerQuery = query.ToLower();

            var books = await db.Books
                .Where(b =>
                    b.Title.ToLower().Contains(lowerQuery) ||
                    b.ISBN.ToLower().Contains(lowerQuery) ||
                    b.Description.ToLower().Contains(lowerQuery)
                )
                .ToListAsync();

            return Ok(new { data = books });
        }

        // Update discount on the book
        [HttpPatch("update-discount/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> UpdateDiscount(Guid id, [FromBody] DiscountUpdateDTO discount)
        {
            var book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { error = "Book not found." });
            }

            if (discount.DiscountPercentage < 0 || discount.DiscountPercentage > 100)
            {
                return BadRequest(new { error = "Discount percentage must be between 0 and 100." });
            }

            // Update only discount fields
            book.IsOnSale = true;
            book.DiscountPercentage = discount.DiscountPercentage;
            book.DiscountStartDate = discount.DiscountStartDate?.ToUniversalTime();
            book.DiscountEndDate = discount.DiscountEndDate?.ToUniversalTime();

            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Discount updated successfully.",
                data = new
                {
                    book.Id,
                    book.Title,
                    book.Price,
                    book.DiscountPercentage,
                    book.DiscountStartDate,
                    book.DiscountEndDate,
                    currentPrice = book.GetCurrentPrice()
                }
            });
        }
    }
}
