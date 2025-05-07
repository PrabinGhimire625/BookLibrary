using System;

namespace BookLibrary.Dto
{
    public class WhiteListCreateDto
    {
        public Guid UserId { get; set; }
        public Guid BookId { get; set; }
    }
}