using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class Category
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Category name is required")]
        [MaxLength(50, ErrorMessage = "Category name must be less than 50 characters")]
        public string CategoryName { get; set; }
    }
}
