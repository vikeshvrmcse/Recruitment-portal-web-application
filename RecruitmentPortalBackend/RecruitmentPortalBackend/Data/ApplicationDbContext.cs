using Microsoft.EntityFrameworkCore;
using RecruitmentPortalBackend.Models;
namespace RecruitmentPortalBackend.Data
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
                : base(options)
        {
        }

        // Example table (optional for now)
        public DbSet<EmployeeDetails> EmployeeDetails { get; set; }
    }
}
