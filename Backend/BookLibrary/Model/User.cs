using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name can't be longer than 100 characters")]
        public string Name { get; set; }

        [StringLength(200, ErrorMessage = "Address can't be longer than 200 characters")]
        public string? Address { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(100)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; } = UserRoles.User;
    }

    public static class UserRoles
    {
        public const string Admin = "Admin";
        public const string User = "Member";
        public const string Staff = "Staff";
    }
}
