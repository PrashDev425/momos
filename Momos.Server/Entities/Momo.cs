﻿using System.ComponentModel.DataAnnotations;

namespace Momos.Server.Entities
{
    public class Momo
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        [Required]
        public decimal Price { get; set; }
        public string? ImagePath { get; set; } = string.Empty;
        public string? Tags { get; set; }
    }
}
