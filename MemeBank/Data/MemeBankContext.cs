using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MemeBank.Models
{
    public class MemeBankContext : DbContext
    {
        public MemeBankContext (DbContextOptions<MemeBankContext> options)
            : base(options)
        {
        }

        public DbSet<MemeBank.Models.MemeItem> MemeItem { get; set; }
    }
}
