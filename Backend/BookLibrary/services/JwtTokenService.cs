using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookLibrary.Model;

public class JwtTokenService
{
    private readonly IConfiguration _config;

    public JwtTokenService(IConfiguration config)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config), "Configuration cannot be null.");
    }

    public string GenerateToken(User user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user), "User cannot be null.");
        }

        if (string.IsNullOrEmpty(user.Email))
        {
            throw new ArgumentNullException(nameof(user.Email), "User email cannot be null or empty.");
        }

        if (string.IsNullOrEmpty(user.Role))
        {
            user.Role = UserRoles.User; // Default role if not provided
        }

        // Ensure that the configuration values exist and are valid
        var key = _config["Jwt:Key"];  // Change from JwtConfig to Jwt
        var issuer = _config["Jwt:Issuer"];  // Change from JwtConfig to Jwt
        var audience = _config["Jwt:Audience"];  // Change from JwtConfig to Jwt
        var tokenValidityMins = _config["Jwt:ExpiresInMinutes"];  // Change from JwtConfig to Jwt

        if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience) || string.IsNullOrEmpty(tokenValidityMins))
        {
            throw new InvalidOperationException("JWT configuration values are missing or invalid.");
        }

        var claims = new[] 
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role) // Default role used if not provided
        };

        var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(double.Parse(tokenValidityMins)),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
