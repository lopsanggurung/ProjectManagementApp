using System;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace App.API.Filters
{
    public class LogUserActivityFilter : IAsyncActionFilter
    {
        private readonly ApplicationDbContext _context;
        public LogUserActivityFilter(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            var userId = resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            user.LastActive = DateTime.Now;
            await _context.SaveChangesAsync();
        }
    }
}