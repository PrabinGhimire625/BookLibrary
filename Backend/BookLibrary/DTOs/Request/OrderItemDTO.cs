using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.DTOs.Request;
public class OrderItemDto
{
    public string BookTitle { get; set; }
    public int Quantity { get; set; }
    public decimal PricePerUnit { get; set; }
}