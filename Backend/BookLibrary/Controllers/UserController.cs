using BookLibrary.Data;
using BookLibrary.DTOs;
using BookLibrary.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using BookLibrary.DTOs.Request;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        public async Task<IActionResult> RegisterUser([FromBody] RegisterDTO registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists
            if (await db.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return Conflict("User with this email already exists.");
            }

            // Determine if this is the first user
            bool isFirstUser = !await db.Users.AnyAsync();

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Name = registerDto.Name,
                Address = registerDto.Address,
                Phone = registerDto.Phone,
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = isFirstUser
                    ? UserRoles.Admin
                    : string.IsNullOrEmpty(registerDto.Role) ? UserRoles.User : registerDto.Role
            };

            await db.Users.AddAsync(newUser);
            await db.SaveChangesAsync();

            return Ok(new
            {
                Message = "User registered successfully",
                data = new
                {
                    newUser.Id,
                    newUser.Name,
                    newUser.Email,
                    newUser.Role
                }
            });
        }

        // Login an existing user
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginDTO loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return Unauthorized("Invalid email or password.");
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                Message = "Login successful",
                Token = token,
                data = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role
                }
            });
        }


        //profile
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("Invalid token. User ID not found.");
            }

            if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return Unauthorized("Invalid user ID in token.");
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new
            {
                data = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Address,
                    user.Phone,
                    user.Role
                }
            });
        }

        // Get all users
        [HttpGet("getAllUsers")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await db.Users.ToListAsync();
            return Ok(users);
        }


        // Update an existing user
        [HttpPatch("update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDTO updateUserDto)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Name = updateUserDto.Name ?? user.Name;
            user.Address = updateUserDto.Address ?? user.Address;
            user.Phone = updateUserDto.Phone ?? user.Phone;

            await db.SaveChangesAsync();

            return Ok(new
            {
                Message = "User updated successfully",
                User = new
                {
                    user.Id,
                    user.Name,
                    user.Address,
                    user.Phone
                }
            });
        }


        //get the user details
        [HttpGet("singleUser/{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await db.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { error = "User not found." });
            }

            return Ok(user);
        }

        // Delete a user
        [HttpDelete("delete/{id}")]
        [Authorize(Policy = "RequireAdminRole")]

        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return Ok(new { Message = "User deleted successfully" });
        }
    }
}
