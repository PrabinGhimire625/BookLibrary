using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.DTOs.Request
{
    public class OrderItemDto
    {
         public Guid BookId { get; set; } 
        public string BookTitle { get; set; }
        public int Quantity { get; set; }
        public decimal PricePerUnit { get; set; }

        public string CoverImage { get; set; }  
        public string Genre { get; set; }       
        public string Category { get; set; }    
    }
}
