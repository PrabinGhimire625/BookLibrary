using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace BookLibrary.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseConnection db;
        private readonly JwtTokenService _jwtService;

        public UserController(DatabaseConnection db, JwtTokenService jwtService)
        {
            this.db = db;
            this._jwtService = jwtService;
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists
            if (await db.Users.AnyAsync(u => u.Email == user.Email))
            {
                return Conflict("User with this email already exists.");
            }

            // Hash the password before saving
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            user.Id = Guid.NewGuid(); // Set the ID
            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPost("login")]

        public async Task<IActionResult> LoginUser([FromBody] User loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Verify the hashed password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password);

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Generate JWT token
            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                Message = "Login successful",
                Token = token,
                User = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role
                }
            });
        }


    }
}
