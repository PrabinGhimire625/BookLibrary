using System;

public class DiscountUpdateDTO
{
    public decimal DiscountPercentage { get; set; }
    public DateTime? DiscountStartDate { get; set; }
    public DateTime? DiscountEndDate { get; set; }
}
