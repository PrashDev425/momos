using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momos.Server.Entities;
using Momos.Server.Models.Request.Auth;
using Momos.Server.Models.Response.Auth;
using Momos.Server.Models.Response.Template;
using Momos.Server.Services.TokenService.Interface;
using Momos.Server.UnitOfWork.Interface;

namespace Momos.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IUnitOfWork _unitOfWork;

        public AuthController(ITokenService tokenService, IUnitOfWork unitOfWork)
        {
            _tokenService = tokenService;
            _passwordHasher = new PasswordHasher<User>();
            _unitOfWork = unitOfWork;
        }

        [HttpPost("register")]
        public async Task<ActionResult<OperationResponse<RegisterRequest>>> Register([FromForm] RegisterRequest request)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (_unitOfWork.Users.Set().Any(u => u.Username == request.Username))
                    {
                        return BadRequest(new OperationResponse<RegisterRequest>(false, "User already exists.", 0, request));
                    }
                    var user = new User { Username = request.Username };
                    user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
                    _unitOfWork.Users.Insert(user);
                    var rowAffected = await _unitOfWork.CompleteAsync();
                    return Ok(new OperationResponse<RegisterRequest>(true, "User registered successfully.", rowAffected, request));
                }
                else
                {
                    return BadRequest(new OperationResponse<RegisterRequest>(false, "Validation error.", 0, request)
                        .AddValidationError(ModelState));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResponse<RegisterRequest>(false, $"Exception : {ex.Message}", 0, request));
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse<LoginRequest>>> Login([FromForm] LoginRequest request)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _unitOfWork.Users.Set().AsNoTracking().FirstOrDefaultAsync(u => u.Username == request.Username);
                    if (user == null)
                        return Unauthorized(new LoginResponse<LoginRequest>(false, "Validation Error", request).AddValidationError("Username", "Username not found"));
                    var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
                    if (result == PasswordVerificationResult.Failed)
                        return Unauthorized(new LoginResponse<LoginRequest>(false, "Validation Error", request).AddValidationError("Password", "Invalid password"));
                    var token = _tokenService.CreateToken(user);
                    Response.Cookies.Append("token", token, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true, // Required for SameSite=None
                        SameSite = SameSiteMode.None, // Allow cross-origin requests
                        Expires = DateTimeOffset.UtcNow.AddDays(1)
                    });
                    return Ok(new LoginResponse<LoginRequest>(true, "Login successful", request).SetToken(token));
                }
                else
                {
                    return BadRequest(new LoginResponse<LoginRequest>(false, "Validation error.", request)
                        .AddValidationError(ModelState));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new LoginResponse<LoginRequest>(false, $"Exception : {ex.Message}", request));
            }
        }

        [HttpPost("logout")]
        public ActionResult<ProcessResponse> Logout()
        {
            try
            {
                Response.Cookies.Delete("token");
                return Ok(new ProcessResponse(true,"Logged out successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ProcessResponse(true, $"Exception : {ex.Message}"));
            }
        }
    }
}
