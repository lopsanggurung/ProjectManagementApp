using System.Collections.Generic;
using System.Threading.Tasks;
using App.Domain.Entities;
using App.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.API.Controllers
{
    // GET http://localhost:5000/api/values
    public class ValuesController : ApiController
    {
        private readonly ApplicationDbContext _context;
        public ValuesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET api/values
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet]
        public async Task<ActionResult<IList<Value>>> GetValues()
        {
            var values = await _context.Values.ToListAsync();

            return Ok(values);
        }

        // GET api/values/5
        [Authorize(Policy = "ManagerRole")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Value>> GetValue(int id)
        {
            var value = await _context.Values.FirstOrDefaultAsync(x => x.Id == id);

            return Ok(value);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}