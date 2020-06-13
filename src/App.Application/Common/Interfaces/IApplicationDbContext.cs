using System.Threading;
using System.Threading.Tasks;
using App.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace App.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Value> Values { get; set; }
        DbSet<TodoList> TodoLists { get; set; }
        DbSet<TodoItem> TodoItems { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}