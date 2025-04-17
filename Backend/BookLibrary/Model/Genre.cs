using System;
using System;
using System.ComponentModel.DataAnnotations;
namespace BookLibrary.Model;

public class Genre
{
     [Key]
        public Guid GenreId { get; set; }

        [Required(ErrorMessage = "Genre is required")]
        public string GenreName { get; set; }

}
