using Microsoft.EntityFrameworkCore;
using RecruitmentWebAPI.Models;
namespace RecruitmentWebAPI.Data
{
    public class ApplicationDBContext:DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { }

        public DbSet<RequisitionModels> Requisitions { get; set; }
        public DbSet<EmployeeDetails> EmployeeDetails { get; set; }
        public DbSet<RequisitionApprovalModel> RequisitionApprovalModels { get; set; }
        public DbSet<ImprovedRequisitionApprovalModel> RequisitionVerifierModels { get; set; }
        public DbSet<HRActionModels> HRActionModels { get; set; }

    }
}
