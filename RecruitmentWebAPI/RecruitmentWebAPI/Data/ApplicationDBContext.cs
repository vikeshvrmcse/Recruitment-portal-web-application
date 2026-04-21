using Microsoft.EntityFrameworkCore;
using RecruitmentWebAPI.Models;
namespace RecruitmentWebAPI.Data
{
    public class ApplicationDBContext:DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { }

        public DbSet<EmployeeDetails> EmployeeDetails { get; set; }
        public DbSet<RequisitionModels> Requisitions { get; set; }
        public DbSet<SubAdminAprovalModels> SubAdminModels { get; set; }

        public DbSet<RequisitionApprovalModel> RequisitionApprovalModels { get; set; }


    
    }
}
