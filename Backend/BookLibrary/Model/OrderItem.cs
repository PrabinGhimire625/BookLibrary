using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model
{
    public class OrderItem
    {
        [Key]
        public Guid OrderItemId { get; set; } = Guid.NewGuid(); // Auto-generate on creation

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100")]
        public int Quantity { get; set; }


        public decimal UnitPrice { get; set; }

        [Required(ErrorMessage = "Order ID is required")]
        public Guid OrderId { get; set; }  // OrderId as Guid (matching the Order model's OrderId)

        [Required(ErrorMessage = "Book ID is required")]
        public Guid BookId { get; set; }  // BookId as Guid

        [ForeignKey(nameof(OrderId))]
        public Order? Order { get; set; }  // Relationship with Order (nullable)

        [ForeignKey(nameof(BookId))]
        public Book? Book { get; set; }  // Relationship with Book (nullable)
    }
}
