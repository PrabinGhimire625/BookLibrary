using System.Security.Claims;
using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/review")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly DatabaseConnection db;

        public ReviewController(DatabaseConnection db)
        {
            this.db = db;
        }


        [HttpPost("add")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> AddReview([FromBody] Review review)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                    return Unauthorized("User ID not found in token.");

                var userId = Guid.Parse(userIdClaim.Value);

                // Check if book exists
                var book = await db.Books.FirstOrDefaultAsync(b => b.Id == review.BookId);
                if (book == null)
                    return NotFound("Book not found.");

                // Populate review fields
                review.UserId = userId;
                review.ReviewId = Guid.NewGuid();
                review.ReviewDate = DateTime.UtcNow;

                db.Reviews.Add(review);
                await db.SaveChangesAsync();

                // Load user (optional, if needed in response)
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);

                return Ok(new
                {
                    review.ReviewId,
                    review.Rating,
                    review.Comment,
                    review.ReviewDate,
                    Book = new { book.Id, book.Title },
                    User = new { user?.Id, user?.Name }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Something went wrong: {ex.Message}");
            }
        }

        /// Get all reviews with related user and book information.
        [HttpGet("getall")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllReviews()
        {
            try
            {
                var reviews = await db.Reviews
                    .Include(r => r.User)
                    .Include(r => r.Book)
                    .Select(r => new
                    {
                        r.ReviewId,
                        r.Rating,
                        r.Comment,
                        r.ReviewDate,
                        User = new
                        {
                            r.User.Id,
                            r.User.Name
                        },
                        Book = new
                        {
                            r.Book.Id,
                            r.Book.Title
                        }
                    })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving reviews: {ex.Message}");
            }
        }

        [HttpGet("singleBook/{bookId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<ActionResult<IEnumerable<object>>> GetReviewsByBookId(Guid bookId)
        {
            try
            {
                var bookExists = await db.Books.AnyAsync(b => b.Id == bookId);
                if (!bookExists)
                    return NotFound("Book not found.");

                var reviews = await db.Reviews
                    .Where(r => r.BookId == bookId)
                    .Include(r => r.User)
                    .Include(r => r.Book)
                    .Select(r => new
                    {
                        r.ReviewId,
                        r.Rating,
                        r.Comment,
                        r.ReviewDate,
                        User = new
                        {
                            r.User.Id,
                            r.User.Name
                        },
                        Book = new
                        {
                            r.Book.Id,
                            r.Book.Title
                        }
                    })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving reviews for the book: {ex.Message}");
            }
        }


    }
}
