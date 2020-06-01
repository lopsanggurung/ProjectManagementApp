using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using App.API.Dtos;
using App.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace App.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthController(IConfiguration config, UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            var userToCreate = new ApplicationUser()
            {
                UserName = userForRegisterDto.UserName,
                Created = userForRegisterDto.Created,
                LastActive = userForRegisterDto.LastActive
            };

            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.Password);

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

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _userManager.FindByNameAsync(userForLoginDto.UserName);

            if (user == null)
            {
                return Unauthorized();
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);

            if (result.Succeeded)
            {
                var appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.NormalizedUserName == userForLoginDto.UserName.ToUpper());

                var userToReturn = new UserForListDto()
                {
                    Id = appUser.Id,
                    UserName = appUser.UserName,
                    FirstName = appUser.FirstName,
                    LastName = appUser.LastName,
                    Created = appUser.Created,
                    LastActive = appUser.LastActive
                };


                return Ok(new
                {
                    token = GenerateJwtToken(appUser).Result,
                    user = userToReturn
                });
            }

            return Unauthorized();
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                  new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                  new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8
             .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}