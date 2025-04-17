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

        // add the book in the database
        [HttpPost("create")]
         [Authorize] 
        
        public async Task<IActionResult> PostBook([FromBody] Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await db.Books.AnyAsync(b => b.Title == book.Title))
            {
                return Conflict("Book with this title already exists.");
            }

            await db.Books.AddAsync(book);
            await db.SaveChangesAsync();

            return Ok(book);
        }

        //get all the books
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await db.Books.ToListAsync();
            return Ok(books);
        }

        //single book by id
        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            var book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            return Ok(book);
        }

        //update book
        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromBody] Book updatedBook)
        {
            var existingBook = await db.Books.FindAsync(id);
            if (existingBook == null)
            {
                return NotFound("Book not found.");
            }

            // Update fields
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.AddedDate = updatedBook.AddedDate;
            existingBook.IsOnSale = updatedBook.IsOnSale;
            existingBook.Price = updatedBook.Price;

            await db.SaveChangesAsync();
            return Ok(existingBook);
        }

        //delete book
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            var book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            db.Books.Remove(book);
            await db.SaveChangesAsync();

            return Ok("Book deleted successfully.");
        }











    }
}
