using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model
{
    public class Cart
    {
        [Key]
        public Guid CartId { get; set; }

        [Required]
        public int TotalItems { get; set; }

        // [Required]
        // public decimal CartTotal { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid BookId { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        [ForeignKey(nameof(BookId))]
        public Book? Book { get; set; }
    }
}
