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

        //give the review rating and comment
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

        //get the review for the single book
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

        //get all book with the rating
        [HttpGet("getAllBook")]
        public async Task<IActionResult> GetAllBooksWithRatingAndReviews()
        {
            try
            {
                var booksWithRatings = await db.Books
                    .Select(book => new
                    {
                        id = book.Id,
                        title = book.Title,
                        isbn = book.ISBN,
                        author = book.Author,
                        isOnSale = book.IsOnSale,
                        addedDate = book.AddedDate,
                        publicationDate = book.PublicationDate,
                        price = book.Price,
                        genre = book.Genre,
                        category = book.Category,
                        description = book.Description,
                        coverImage = book.CoverImage,
                        stock = book.Stock,
                        currentPrice = book.GetCurrentPrice(),
                        discountPercentage = book.DiscountPercentage,
                        discountStartDate = book.DiscountStartDate,
                        discountEndDate = book.DiscountEndDate,
                        averageRating = db.Reviews
                            .Where(r => r.BookId == book.Id)
                            .Average(r => (double?)r.Rating) ?? 0.0,
                        totalReviews = db.Reviews
                            .Count(r => r.BookId == book.Id)
                    })
                    .ToListAsync();

                return Ok(new { data = booksWithRatings });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving book data: {ex.Message}");
            }
        }

        //fetch the latest 5 book
        [HttpGet("latest5Books")]
        public async Task<IActionResult> GetLatest5Books()
        {
            try
            {
                var latestBooks = await db.Books
                    .OrderByDescending(b => b.AddedDate)
                    .Take(5)
                    .Select(book => new
                    {
                        id = book.Id,
                        title = book.Title,
                        isbn = book.ISBN,
                        author = book.Author,
                        isOnSale = book.IsOnSale,
                        addedDate = book.AddedDate,
                        publicationDate = book.PublicationDate,
                        price = book.Price,
                        genre = book.Genre,
                        category = book.Category,
                        description = book.Description,
                        coverImage = book.CoverImage,
                        stock = book.Stock,
                        currentPrice = book.GetCurrentPrice(),
                        discountPercentage = book.DiscountPercentage,
                        discountStartDate = book.DiscountStartDate,
                        discountEndDate = book.DiscountEndDate,
                        averageRating = db.Reviews
                            .Where(r => r.BookId == book.Id)
                            .Average(r => (double?)r.Rating) ?? 0.0,
                        totalReviews = db.Reviews
                            .Count(r => r.BookId == book.Id)
                    })
                    .ToListAsync();

                return Ok(new { data = latestBooks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving latest books: {ex.Message}");
            }
        }


        //get the latest 5 historical book
        [HttpGet("latest5historicalBooks")]
        public async Task<IActionResult> GetLatest5HistoricalBooks()
        {
            try
            {
                var historicalBooks = await db.Books
                    .Where(b => b.Category != null && b.Category.ToLower() == "historical")
                    .OrderByDescending(b => b.AddedDate)
                    .Take(5)
                    .Select(book => new
                    {
                        id = book.Id,
                        title = book.Title,
                        isbn = book.ISBN,
                        author = book.Author,
                        isOnSale = book.IsOnSale,
                        addedDate = book.AddedDate,
                        publicationDate = book.PublicationDate,
                        price = book.Price,
                        genre = book.Genre,
                        category = book.Category,
                        description = book.Description,
                        coverImage = book.CoverImage,
                        stock = book.Stock,
                        currentPrice = book.GetCurrentPrice(),
                        discountPercentage = book.DiscountPercentage,
                        discountStartDate = book.DiscountStartDate, 
                        discountEndDate = book.DiscountEndDate,  
                        averageRating = db.Reviews
                            .Where(r => r.BookId == book.Id)
                            .Average(r => (double?)r.Rating) ?? 0.0,
                        totalReviews = db.Reviews
                            .Count(r => r.BookId == book.Id)
                    })
                    .ToListAsync();

                return Ok(new { data = historicalBooks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving historical books: {ex.Message}");
            }
        }


        //get the latest 5 romance book
        [HttpGet("latest5RomanceBooks")]
        public async Task<IActionResult> GetLatest5RomanceBooks()
        {
            try
            {
                var romanceBooks = await db.Books
                    .Where(b => b.Genre != null && b.Genre.ToLower() == "romance")
                    .OrderByDescending(b => b.AddedDate)
                    .Take(5)
                    .Select(book => new
                    {
                        id = book.Id,
                        title = book.Title,
                        isbn = book.ISBN,
                        author = book.Author,
                        isOnSale = book.IsOnSale,
                        addedDate = book.AddedDate,
                        publicationDate = book.PublicationDate,
                        price = book.Price,
                        genre = book.Genre,
                        category = book.Category,
                        description = book.Description,
                        coverImage = book.CoverImage,
                        stock = book.Stock,
                        currentPrice = book.GetCurrentPrice(),
                        discountPercentage = book.DiscountPercentage,
                        discountStartDate = book.DiscountStartDate, 
                        discountEndDate = book.DiscountEndDate,  
                        averageRating = db.Reviews
                            .Where(r => r.BookId == book.Id)
                            .Average(r => (double?)r.Rating) ?? 0.0,
                        totalReviews = db.Reviews
                            .Count(r => r.BookId == book.Id)
                    })
                    .ToListAsync();

                return Ok(new { data = romanceBooks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving romance books: {ex.Message}");
            }
        }

        //get the top 5 book based on the rating
        [HttpGet("top5HighestRatedBooks")]
        public async Task<IActionResult> GetTop5HighestRatedBooks()
        {
            try
            {
                var topRatedBooks = await db.Books
                    .Select(book => new
                    {
                        id = book.Id,
                        title = book.Title,
                        isbn = book.ISBN,
                        author = book.Author,
                        isOnSale = book.IsOnSale,
                        addedDate = book.AddedDate,
                        publicationDate = book.PublicationDate,
                        price = book.Price,
                        genre = book.Genre,
                        category = book.Category,
                        description = book.Description,
                        coverImage = book.CoverImage,
                        stock = book.Stock,
                        currentPrice = book.GetCurrentPrice(),
                        discountPercentage = book.DiscountPercentage,
                        discountStartDate = book.DiscountStartDate, 
                        discountEndDate = book.DiscountEndDate,  
                        averageRating = db.Reviews
                            .Where(r => r.BookId == book.Id)
                            .Average(r => (double?)r.Rating) ?? 0.0,
                        totalReviews = db.Reviews
                            .Count(r => r.BookId == book.Id)
                    })
                    .OrderByDescending(b => b.averageRating)
                    .ThenByDescending(b => b.totalReviews)
                    .Take(5)
                    .ToListAsync();

                return Ok(new { data = topRatedBooks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving top rated books: {ex.Message}");
            }
        }
    }
}
