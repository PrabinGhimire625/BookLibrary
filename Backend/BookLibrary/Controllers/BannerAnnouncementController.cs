using BookLibrary.Data;
using BookLibrary.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BookLibrary.Controllers
{
    [Route("api/banner-announcement")]
    [ApiController]
    public class BannerAnnouncementController : ControllerBase
    {
        private readonly DatabaseConnection db;
        private readonly ILogger<BannerAnnouncementController> _logger;

        public BannerAnnouncementController(DatabaseConnection db, ILogger<BannerAnnouncementController> logger)
        {
            this.db = db;
            _logger = logger;
        }

        // CREATE
        [HttpPost("create")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> Create([FromBody] BannerAnnouncement model)
        {
            if (!ModelState.IsValid)
            {
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    _logger.LogError("Model error: " + error.ErrorMessage);
                }
                return BadRequest(ModelState);
            }

            if (model.EndTime <= model.StartTime)
                return BadRequest("End time must be after start time.");

            model.BannerAnnouncementId = Guid.NewGuid();

            try
            {
                // Adding a check for existing banner conflict in the time frame
                var existingBanner = await db.BannerAnnouncements
                    .FirstOrDefaultAsync(b => b.StartTime < model.EndTime && b.EndTime > model.StartTime);

                if (existingBanner != null)
                    return Conflict("A banner announcement already exists in the specified time frame.");

                await db.BannerAnnouncements.AddAsync(model);
                await db.SaveChangesAsync();

                return Ok(model);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Database update failed: {ex.Message}");
            }
        }

        // GET active announcement
        [HttpGet("getActiveAnnouncement")]
        public async Task<IActionResult> GetActive()
        {
            try
            {
                var now = DateTime.UtcNow;

                var activeBanners = await db.BannerAnnouncements
                    .Where(b => b.StartTime <= now && b.EndTime >= now)
                    .ToListAsync();

                return Ok(activeBanners);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET ALL
        [HttpGet("getAllAnnouncement")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var banners = await db.BannerAnnouncements.ToListAsync();
                return Ok(banners);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET SINGLE
        [HttpGet("singleAnnouncement/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var banner = await db.BannerAnnouncements.FindAsync(id);
                if (banner == null)
                    return NotFound();

                return Ok(banner);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // UPDATE
        [HttpPatch("update/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> Update(Guid id, [FromBody] BannerAnnouncement model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existing = await db.BannerAnnouncements.FindAsync(id);
                if (existing == null)
                    return NotFound();

                if (model.EndTime <= model.StartTime)
                    return BadRequest("End time must be after start time.");

                // Check for conflicts: Same time frame for another announcement
                var conflictingBanner = await db.BannerAnnouncements
                    .FirstOrDefaultAsync(b => b.BannerAnnouncementId != id && b.StartTime < model.EndTime && b.EndTime > model.StartTime);

                if (conflictingBanner != null)
                    return Conflict("A banner announcement already exists in the specified time frame.");

                existing.Title = model.Title;
                existing.Message = model.Message;
                existing.StartTime = model.StartTime;
                existing.EndTime = model.EndTime;

                await db.SaveChangesAsync();
                return Ok(existing);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Database update failed: {ex.Message}");
            }
        }

        // DELETE
        [HttpDelete("delete/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var banner = await db.BannerAnnouncements.FindAsync(id);
                if (banner == null)
                    return NotFound("Banner announcement not found.");

                db.BannerAnnouncements.Remove(banner);
                await db.SaveChangesAsync();

                return Ok("Banner announcement deleted successfully.");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Database update failed: {ex.Message}");
            }
        }

    }
}
