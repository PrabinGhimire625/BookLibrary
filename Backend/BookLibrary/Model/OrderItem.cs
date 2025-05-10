using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model
{
    public class OrderItem
    {
        [Key]
        public Guid OrderItemId { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100")]
        public int Quantity { get; set; }


        public decimal UnitPrice { get; set; }

        [Required(ErrorMessage = "Order ID is required")]
        public Guid OrderId { get; set; }  

        [Required(ErrorMessage = "Book ID is required")]
        public Guid BookId { get; set; }  

        [ForeignKey(nameof(OrderId))]
        public Order? Order { get; set; }  

        [ForeignKey(nameof(BookId))]
        public Book? Book { get; set; }  
    }
}
