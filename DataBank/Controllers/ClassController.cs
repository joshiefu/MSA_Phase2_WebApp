using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DataBank.Models;

namespace DataBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly DataBankContext _context;

        public ClassController(DataBankContext context)
        {
            _context = context;
        }

        // GET: api/Class
        [HttpGet]
        public IEnumerable<ClassItem> GetClassItem()
        {
            return _context.ClassItem;
        }

        // GET: api/Class/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClassItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var classItem = await _context.ClassItem.FindAsync(id);

            if (classItem == null)
            {
                return NotFound();
            }

            return Ok(classItem);
        }

        // PUT: api/Class/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClassItem([FromRoute] int id, [FromBody] ClassItem classItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != classItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(classItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Class
        [HttpPost]
        public async Task<IActionResult> PostClassItem([FromBody] ClassItem classItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ClassItem.Add(classItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClassItem", new { id = classItem.Id }, classItem);
        }

        // DELETE: api/Class/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var classItem = await _context.ClassItem.FindAsync(id);
            if (classItem == null)
            {
                return NotFound();
            }

            _context.ClassItem.Remove(classItem);
            await _context.SaveChangesAsync();

            return Ok(classItem);
        }

        private bool ClassItemExists(int id)
        {
            return _context.ClassItem.Any(e => e.Id == id);
        }
    }
}