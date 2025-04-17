using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        public string? Name { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        // Default role is "Member", but you can explicitly set "Admin"
        public string? Role { get; set; } = UserRoles.User;
    }

    public static class UserRoles
    {
        public const string Admin = "Admin";
        public const string User = "User";
    }
}
