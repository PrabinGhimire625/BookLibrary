using System;
using System.ComponentModel.DataAnnotations;
namespace BookLibrary.Model;

public class Book
{
    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Title is required")]
    [MaxLength(50, ErrorMessage = "Title must be less than 50 characters")]
    public string Title { get; set; }


    // public string Image { get; set; }
    public string ISBN { get; set; }

    [MaxLength(100, ErrorMessage = "Author must be less than 100 characters")]
    public string Author { get; set; }
    //public string Publisher { get; set; }

    public DateTime AddedDate { get; set; } = DateTime.UtcNow;

    public bool IsOnSale { get; set; }
    public DateTime PublicationDate { get; set; } = DateTime.UtcNow;


    [Required(ErrorMessage = "Price is required")]
    public decimal Price { get; set; }
    public string Genre { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    // public ICollection<Review> Reviews { get; set; } // List of reviews for the book

}
