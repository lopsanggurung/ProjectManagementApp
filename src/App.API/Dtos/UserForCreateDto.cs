using System;
using System.ComponentModel.DataAnnotations;

namespace App.API.Dtos
{
    public class UserForCreateDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "You must specify password between 6 and 20 characters")]
        public string Password { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }

        public UserForCreateDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}