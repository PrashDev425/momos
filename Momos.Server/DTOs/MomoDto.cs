using System.ComponentModel.DataAnnotations;

namespace Momos.Server.DTOs
{
    public class MomoDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        [Required]
        public decimal Price { get; set; }
        public IFormFile? Image { get; set; }
        public List<string>? Tags { get; set; }
    }
}
