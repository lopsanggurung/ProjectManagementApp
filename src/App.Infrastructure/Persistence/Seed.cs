using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Domain.Entities;
using App.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace App.Infrastructure.Persistence
{
    public class Seed
    {
        public Seed() { }

        public static void SeedUsers(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            if (!userManager.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("../App.Infrastructure/Persistence/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<ApplicationUser>>(userData);

                var roles = new List<IdentityRole>
                {
                    new IdentityRole{Name = "Admin"},
                    new IdentityRole{Name = "Manager"},
                    new IdentityRole{Name = "Member"}
                };

                foreach (var role in roles)
                {
                    roleManager.CreateAsync(role).Wait();
                }

                // Seed Admin User
                var adminUser = new ApplicationUser
                {
                    UserName = "Admin",
                    Created = DateTime.Now.AddDays(-7),
                    LastActive = DateTime.Now
                };

                IdentityResult result = userManager.CreateAsync(adminUser, "password").Result;

                if (result.Succeeded)
                {
                    var admin = userManager.FindByNameAsync("Admin").Result;
                    userManager.AddToRolesAsync(admin, new[] { "Admin", "Manager" }).Wait();
                }

                // Seed Regular Users
                foreach (var user in users)
                {
                    user.Created = DateTime.Now.AddDays(-7);
                    user.LastActive = DateTime.Now;

                    userManager.CreateAsync(user, "password").Wait();
                    userManager.AddToRoleAsync(user, "Member").Wait();
                }

            }
        }

        public static async Task SeedData(ApplicationDbContext context)
        {
            if (!context.TodoLists.Any())
            {
                context.TodoLists.Add(new TodoList
                {
                    Title = "Shopping",
                    Items =
                    {
                        new TodoItem { Title = "Apples", Done = true },
                        new TodoItem { Title = "Milk", Done = true },
                        new TodoItem { Title = "Bread", Done = true },
                        new TodoItem { Title = "Toilet paper" },
                        new TodoItem { Title = "Pasta" },
                        new TodoItem { Title = "Tissues" },
                        new TodoItem { Title = "Tuna" },
                        new TodoItem { Title = "Water" }
                    }
                });

                await context.SaveChangesAsync();
            }
        }
    }
}