using System;

namespace BookLibrary.Model;

public class Order
{
    public Guid Id { get; set; } // Unique identifier for the order
    public Guid UserId { get; set; } // The user who placed the order
    public DateTime OrderDate { get; set; } // Date the order was placed
    public decimal TotalPrice { get; set; } // Total price of the order
    public int PhoneNumber { get; set; } // Total price of the order
    public string ShippingAddress { get; set; } // Total price of the order
    public string OrderStatus { get; set; } // Total price of the order
    //public ICollection<OrderBook> OrderBooks { get; set; } // Books included in the order
}
