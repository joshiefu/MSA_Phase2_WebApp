using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DataBank.Models
{
    public class DataBankContext : DbContext
    {
        public DataBankContext (DbContextOptions<DataBankContext> options)
            : base(options)
        {
        }

        public DbSet<DataBank.Models.ClassItem> ClassItem { get; set; }
    }
}
