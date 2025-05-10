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

        // Add the book to whitelist
        [HttpPost]

        public async Task<IActionResult> AddToWhiteList([FromBody] WhiteListCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            Guid userId = Guid.Parse(userIdClaim.Value);
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

        //remove from the whiselist
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


        //Get whitelist  of the user
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
                .Include(w => w.Book)
                .Where(w => w.UserId == userId)
                .Select(w => new
                {
                    w.BookId,
                    CoverImage = w.Book.CoverImage,
                    BookTitle = w.Book.Title,
                    BookAuthor = w.Book.Author,
                    Genre = w.Book.Genre,
                    Category = w.Book.Category,
                    w.WhiteListId
                })
                .ToListAsync();

            return Ok(whitelist);
        }
    }
}