using System;

namespace App.API.Dtos
{
    public class UserForListDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
    }
}