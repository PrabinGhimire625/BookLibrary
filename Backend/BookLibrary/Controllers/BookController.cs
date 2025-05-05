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

            // Ensure AddedDate and PublicationDate are in UTC
            book.AddedDate = book.AddedDate.Kind == DateTimeKind.Utc ? book.AddedDate : book.AddedDate.ToUniversalTime();
            book.PublicationDate = book.PublicationDate.Kind == DateTimeKind.Utc ? book.PublicationDate : book.PublicationDate.ToUniversalTime();

            // Ensure that Price is a positive value
            if (book.Price <= 0)
            {
                return BadRequest(new { error = "Price must be a positive value." });
            }

            await db.Books.AddAsync(book);
            await db.SaveChangesAsync();

            return Ok(new { data = book });
        }
        // Get all the books
        [HttpGet("getAllBook")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await db.Books.ToListAsync();
            return Ok(new { data = books });
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

            return Ok(new { data = book });
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
           // existingBook.AddedDate = updatedBook.AddedDate;
            existingBook.IsOnSale = updatedBook.IsOnSale;
            existingBook.Price = updatedBook.Price;
            existingBook.CoverImage = updatedBook.CoverImage;
            existingBook.Genre = updatedBook.Genre;
            existingBook.Category = updatedBook.Category;
           // existingBook.PublicationDate = updatedBook.PublicationDate;

            
            // Ensure AddedDate and PublicationDate are in UTC
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
    }
}
