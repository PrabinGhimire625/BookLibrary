using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.DTOs.Request;

public class PendingOrderDto
{
  public Guid OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public List<OrderItemDto> Items { get; set; }
     public string TotalPrice { get; set; } // ← Is it string?
    public string Status { get; set; }
}
