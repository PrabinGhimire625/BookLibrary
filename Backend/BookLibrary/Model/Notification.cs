using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model
{
    public class Notification
    {
        [Key]
        public Guid NotificationId { get; set; }

        [Required(ErrorMessage = "Message is required.")]
        [StringLength(300, ErrorMessage = "Message can't exceed 300 characters.")]
        public string Message { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }
    }

       public enum NotificationType
    {
        Pending,
        Delivered,
        Cancelled
    }
}
