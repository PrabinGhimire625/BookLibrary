using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Models
{
    public class BannerAnnouncement
    {
        public Guid BannerAnnouncementId { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Message is required.")]
        [MaxLength(500, ErrorMessage = "Message cannot exceed 500 characters.")]
        public string Message { get; set; }

        [Required(ErrorMessage = "Start time is required.")]
        public DateTime StartTime { get; set; }

        [Required(ErrorMessage = "End time is required.")]
        public DateTime EndTime { get; set; }
    }
}
