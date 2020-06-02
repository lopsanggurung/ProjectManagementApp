using System.Collections.Generic;
using System.Threading.Tasks;
using App.API.Dtos;
using App.API.Filters;
using App.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivityFilter))]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            var userToReturn = new UserForDetailedDto()
            {
                Id = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Created = user.Created,
                LastActive = user.LastActive
            };

            return Ok(userToReturn);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var userList = new List<UserForListDto>();

            foreach (var user in users)
            {
                var newUser = new UserForListDto()
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Created = user.Created,
                    LastActive = user.LastActive
                };

                userList.Add(newUser);
            }

            return Ok(userList);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateUser(UserForCreateDto userForCreateDto)
        {
            var userToCreate = new ApplicationUser()
            {
                UserName = userForCreateDto.UserName,
                Created = userForCreateDto.Created,
                LastActive = userForCreateDto.LastActive
            };

            var result = await _userManager.CreateAsync(userToCreate, userForCreateDto.Password);

            var userToReturn = new UserForDetailedDto()
            {
                Id = userToCreate.Id,
                UserName = userToCreate.UserName,
                FirstName = userToCreate.FirstName,
                MiddleName = userToCreate.MiddleName,
                LastName = userToCreate.LastName,
                Email = userToCreate.Email,
                PhoneNumber = userToCreate.PhoneNumber,
                Created = userToCreate.Created,
                LastActive = userToCreate.LastActive
            };

            if (result.Succeeded)
            {
                IEnumerable<string> defaultRolesList = new List<string>() { "Member" };

                var resultForRole = await _userManager.AddToRolesAsync(userToCreate, defaultRolesList);

                if (!resultForRole.Succeeded)
                    return BadRequest(resultForRole.Errors);

                return CreatedAtRoute("GetUser", new { controller = "Users", Id = userToCreate.Id }, userToReturn);
            }

            return BadRequest(result.Errors);
        }
    }
}