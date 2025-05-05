using System;
using System.ComponentModel.DataAnnotations;

public class Book
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Title is required")]
    [MaxLength(50, ErrorMessage = "Title must be less than 50 characters")]
    public string Title { get; set; }

    [Required(ErrorMessage = "ISBN is required")]
    [MaxLength(20, ErrorMessage = "ISBN must be less than 20 characters")]
    public string ISBN { get; set; }

    [Required(ErrorMessage = "Author is required")]
    [MaxLength(100, ErrorMessage = "Author must be less than 100 characters")]
    public string Author { get; set; }

    [Required]
    public bool IsOnSale { get; set; } = false;

    public DateTime AddedDate { get; set; } = DateTime.UtcNow;

    public DateTime PublicationDate { get; set; } = DateTime.UtcNow;

    [Required(ErrorMessage = "Price is required")]
    [Range(0.01, 10000.0, ErrorMessage = "Price must be a positive value")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Genre is required")]
    [MaxLength(50, ErrorMessage = "Genre must be less than 50 characters")]
    public string Genre { get; set; }

    [Required(ErrorMessage = "Category is required")]
    [MaxLength(50, ErrorMessage = "Category must be less than 50 characters")]
    public string Category { get; set; }

    [Required(ErrorMessage = "Description is required")]
    [MaxLength(1000, ErrorMessage = "Description must be less than 1000 characters")]
    public string Description { get; set; }

    [Required(ErrorMessage = "Cover Image is required")]
    public string CoverImage { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
    public int Stock { get; set; }

    public Book()
    {
        AddedDate = DateTime.UtcNow;
        PublicationDate = DateTime.UtcNow;
    }
}
