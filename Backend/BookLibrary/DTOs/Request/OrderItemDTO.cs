using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.DTOs.Request
{
    public class OrderItemDto
    {
         public Guid BookId { get; set; }  // Add BookId property
        public string BookTitle { get; set; }
        public int Quantity { get; set; }
        public decimal PricePerUnit { get; set; }

        // Add new properties
        public string CoverImage { get; set; }  // URL or path to the cover image
        public string Genre { get; set; }       // Genre of the book (e.g., Fiction, Non-Fiction, Mystery)
        public string Category { get; set; }    // Category of the book (e.g., Science, Romance)
    }
}
