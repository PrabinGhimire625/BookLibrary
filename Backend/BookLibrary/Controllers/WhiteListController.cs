using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BookLibrary.Model;
using BookLibrary.Data;
using BookLibrary.Dto;
using System.Security.Claims;

namespace BookLibrary.Controllers
{
    [Route("api/whiteList")]
    [ApiController]
    [Authorize(Policy = "RequireUserRole")]
    public class WhiteListController : ControllerBase
    {
        private readonly DatabaseConnection db;

        public WhiteListController(DatabaseConnection db)
        {
            this.db = db;
        }

        // POST: api/WhiteList
        [HttpPost]

        public async Task<IActionResult> AddToWhiteList([FromBody] WhiteListCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            Guid userId = Guid.Parse(userIdClaim.Value); // Or use TryParse if you want to be extra safe

            var exists = await db.WhiteLists
                .AnyAsync(w => w.UserId == userId && w.BookId == dto.BookId);

            if (exists)
            {
                return BadRequest("Book is already in the whitelist.");
            }

            var whiteListEntry = new WhiteList
            {
                WhiteListId = Guid.NewGuid(),
                UserId = userId,
                BookId = dto.BookId
            };

            db.WhiteLists.Add(whiteListEntry);
            await db.SaveChangesAsync();

            return Ok("Book added to whitelist.");
        }


        [HttpDelete("delete")]
        public async Task<IActionResult> RemoveFromWhiteList([FromBody] WhiteListDeleteDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
            var entry = await db.WhiteLists.FirstOrDefaultAsync(w => w.UserId == userId && w.BookId == dto.BookId);
            if (entry == null) return NotFound("Book not found in user's whitelist.");
            db.WhiteLists.Remove(entry);
            await db.SaveChangesAsync();
            return Ok("Book removed from whitelist.");
        }


        [HttpGet]
        public async Task<IActionResult> GetWhiteListForUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            Guid userId = Guid.Parse(userIdClaim.Value);

            var whitelist = await db.WhiteLists
                .Include(w => w.Book) // assuming there's a navigation property for Book
                .Where(w => w.UserId == userId)
                .Select(w => new
                {
                    w.BookId,
                    BookTitle = w.Book.Title,       // customize fields as needed
                    BookAuthor = w.Book.Author,     // optional
                    w.WhiteListId
                })
                .ToListAsync();

            return Ok(whitelist);
        }


    }
}