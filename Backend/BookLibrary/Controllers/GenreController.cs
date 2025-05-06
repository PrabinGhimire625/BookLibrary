using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/genres")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly DatabaseConnection db;

        public GenreController(DatabaseConnection db)
        {
            this.db = db;
        }

        // Create a new genre
        [HttpPost("create")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> AddGenre([FromBody] Genre genre)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await db.Genres.AnyAsync(g => g.GenreName == genre.GenreName))
                return Conflict("Genre with this name already exists.");

            await db.Genres.AddAsync(genre);
            await db.SaveChangesAsync();

            return Ok(genre);
        }

        //  Get all genres
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllGenres()
        {
            var genres = await db.Genres.ToListAsync();
            return Ok(genres);
        }

        //  Get genre by ID
        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetGenreById(Guid id)
        {
            var genre = await db.Genres.FindAsync(id);
            if (genre == null)
                return NotFound("Genre not found.");

            return Ok(genre);
        }

        //  Update genre by ID
        [HttpPatch("update/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> UpdateGenre(Guid id, [FromBody] Genre updatedGenre)
        {
            var existingGenre = await db.Genres.FindAsync(id);
            if (existingGenre == null)
                return NotFound("Genre not found.");

            existingGenre.GenreName = updatedGenre.GenreName;
            await db.SaveChangesAsync();

            return Ok(existingGenre);
        }

        //  Delete genre by ID
        [HttpDelete("delete/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteGenre(Guid id)
        {
            var genre = await db.Genres.FindAsync(id);
            if (genre == null)
                return NotFound("Genre not found.");

            db.Genres.Remove(genre);
            await db.SaveChangesAsync();

            return Ok("Genre deleted successfully.");
        }
    }
}
