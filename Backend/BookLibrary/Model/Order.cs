using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model
{
    public class Order
    {
        [Key] 
        public Guid OrderId { get; set; }  

        [Required(ErrorMessage = "User ID is required")]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Order date is required")]
        public DateTime OrderDate { get; set; }

       
        public decimal TotalPrice { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Shipping address is required")]
        [StringLength(500, ErrorMessage = "Shipping address cannot exceed 500 characters")]
        public string ShippingAddress { get; set; }

        [Required(ErrorMessage = "Order status is required")]
        public OrderStatus OrderStatus { get; set; }

        public string ClaimCode { get; set; } = Guid.NewGuid().ToString()[..8].ToUpper();

        [Range(0, 100, ErrorMessage = "Discount must be between 0% and 100%")]
        public decimal? DiscountPercent { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; } 
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); // Initialize as a new list
    }

    public enum OrderStatus
    {
        Pending,
        Processed,
        Shipped,
        Delivered,
        Cancelled
    }
}
