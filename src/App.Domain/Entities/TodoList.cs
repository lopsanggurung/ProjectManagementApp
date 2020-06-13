using System.Collections.Generic;
using App.Domain.Common;

namespace App.Domain.Entities
{
    public class TodoList : AuditableEntity
    {
        public TodoList()
        {
            Items = new List<TodoItem>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Color { get; set; }

        public IList<TodoItem> Items { get; set; }
    }
}