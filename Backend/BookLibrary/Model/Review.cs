using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model;

public class Review
{
    [Key]
    public Guid ReviewId { get; set; }

    [Required(ErrorMessage = "Rating is required")]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5 stars")]
    public int Rating { get; set; }

    [MaxLength(500, ErrorMessage = "Comment is less than 300 character")]
    public string Comment { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime ReviewDate { get; set; } = DateTime.UtcNow;
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
