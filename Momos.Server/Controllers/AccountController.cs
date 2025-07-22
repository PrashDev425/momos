using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Momos.Server.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet("user")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            if (!User.Identity.IsAuthenticated)
                return Unauthorized();

            var userInfo = new
            {
                Id = User.FindFirstValue(ClaimTypes.NameIdentifier),
                Username = User.Identity?.Name,
                Role = User.FindFirstValue(ClaimTypes.Role)
            };

            return Ok(userInfo);
        }
    }
}
