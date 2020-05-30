using System;
using Microsoft.AspNetCore.Identity;

namespace App.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        // Extended Properties
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
    }
}