using System;
using System.ComponentModel.DataAnnotations;
using BookLibrary.Model;

namespace BookLibrary.DTOs.Request;

public class RegisterDTO
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [StringLength(200)]
    public string? Address { get; set; }

    [Phone]
    [StringLength(15)]
    public string? Phone { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; }

    [StringLength(20)]
    public string? Role { get; set; } = UserRoles.User;

}
