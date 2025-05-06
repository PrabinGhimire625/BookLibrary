using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly DatabaseConnection db;

        public CategoryController(DatabaseConnection db)
        {
            this.db = db;
        }

        // Create a new category
        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await db.Categories.AnyAsync(c => c.CategoryName == category.CategoryName))
                return Conflict("Category with this name already exists.");

            await db.Categories.AddAsync(category);
            await db.SaveChangesAsync();

            return Ok(category);
        }

        // Get all categories
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await db.Categories.ToListAsync();
            return Ok(categories);
        }

        // Get category by ID
        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetCategoryById(Guid id)
        {
            var category = await db.Categories.FindAsync(id);
            if (category == null)
                return NotFound("Category not found.");

            return Ok(category);
        }

        // Update category by ID
        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] Category updatedCategory)
        {
            var existingCategory = await db.Categories.FindAsync(id);
            if (existingCategory == null)
                return NotFound("Category not found.");

            existingCategory.CategoryName = updatedCategory.CategoryName;
            await db.SaveChangesAsync();

            return Ok(existingCategory);
        }

        // Delete category by ID
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var category = await db.Categories.FindAsync(id);
            if (category == null)
                return NotFound("Category not found.");

            db.Categories.Remove(category);
            await db.SaveChangesAsync();

            return Ok("Category deleted successfully.");
        }
    }
}
