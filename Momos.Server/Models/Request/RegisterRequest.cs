using System.ComponentModel.DataAnnotations;

namespace Momos.Server.Models.Request
{
    public class RegisterRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
