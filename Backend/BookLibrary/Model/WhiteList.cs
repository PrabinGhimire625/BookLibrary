using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using BookLibrary.Model;

namespace BookLibrary.Model
{
    public class WhiteList
    {
        [Key]
        public Guid WhiteListId { get; set; }

        [Required]
        public Guid BookId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        // Navigation Properties
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        [ForeignKey(nameof(BookId))]
        public Book? Book { get; set; }
    }
}