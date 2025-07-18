﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momos.Server.Data;
using Momos.Server.Entities;
using Momos.Server.Models.Request;
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
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IUnitOfWork _unitOfWork;

        public AuthController(AppDbContext context, ITokenService tokenService, IUnitOfWork unitOfWork)
        {
            _context = context;
            _tokenService = tokenService;
            _passwordHasher = new PasswordHasher<User>();
            _unitOfWork = unitOfWork;
        }

        [HttpPost("register")]
        public async Task<ActionResult<OperationResponse>> Register(RegisterRequest request)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (_unitOfWork.Users.Set().Any(u => u.Username == request.Username))
                    {
                        return BadRequest(new OperationResponse(false, "User already exists.", 0));
                    }
                    var user = new User { Username = request.Username };
                    user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
                    _unitOfWork.Users.Insert(user);
                    var rowAffected = await _unitOfWork.CompleteAsync();
                    return Ok(new OperationResponse(true, "User registered successfully.", rowAffected));
                }
                else
                {
                    return BadRequest(new OperationResponse(false, "Validation error.", 0)
                        .AddValidationError(ModelState));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new OperationResponse(false, $"Exception : {ex.Message}", 0));
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _unitOfWork.Users.Set().AsNoTracking().FirstOrDefaultAsync(u => u.Username == request.Username);
                    if (user == null)
                        return Unauthorized(new LoginResponse(false, "Validation Error").AddValidationError("Username", "Username not found"));
                    var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
                    if (result == PasswordVerificationResult.Failed)
                        return Unauthorized(new LoginResponse(false, "Validation Error").AddValidationError("", "Invalid credentials"));
                    var token = _tokenService.CreateToken(user);
                    return Ok(new LoginResponse(true, "Login successful").SetToken(token));
                }
                else
                {
                    return BadRequest(new LoginResponse(false, "Validation error.")
                        .AddValidationError(ModelState));
                }
            }
            catch(Exception ex) 
            {
                return BadRequest(new LoginResponse(false, $"Exception : {ex.Message}"));
            }
        }
    }
}
