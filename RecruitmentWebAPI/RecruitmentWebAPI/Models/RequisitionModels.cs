using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentWebAPI.Models
{
    public class RequisitionModels
    {
        public string? Id { get; set; } //Primary Key
        public DateTime CreatedAt { get; set; }
        public DateTime Deadline { get; set; }
        public string Department { get; set; }
        public string Description { get; set; }
        public string? EmpID { get; set; } //Foreign Key
        [ForeignKey(nameof(EmpID))]
        public EmployeeDetails? EmployeeDetailDatas { get; set; }
        public List<string> ExperienceLevel { get; set; }
        public string HighestQualification { get; set; }
        public string JobTitle { get; set; }
        public string JobType { get; set; }
        public string Location { get; set; }
        public string ReqType { get; set; }
        public string Requirements { get; set; }
        public string RequisitionReason { get; set; }
        public List<string> Skills { get; set; }
        public string Status { get; set; }
        public int Vacancy { get; set; }
        public int YearOfExperience { get; set; }
        public DateTime UpdatedAt { get; set; }
    }




    public class RequisitionApprovalModel
    {
        public string? Id { get; set; }

        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string? EmpID { get; set; }

        [ForeignKey(nameof(EmpID))]
        public EmployeeDetails? EmployeeDetail { get; set; }

        public string? RequisitionID { get; set; }

        [ForeignKey(nameof(RequisitionID))]
        public RequisitionModels? Requisition { get; set; }

        public string? NextEmpID { get; set; }

        public required string PreviousStatus { get; set; }
        public string? CurrentStatus { get; set; }

        public DateTime UpdatedAt { get; set; }
    }

    public class ImprovedRequisitionApprovalModel
    {
        [Key]
        public string? Id { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string? EmpID { get; set; }

        [ForeignKey(nameof(EmpID))]
        public EmployeeDetails? EmployeeDetail { get; set; }

        public string? RequisitionID { get; set; }

        [ForeignKey(nameof(RequisitionID))]
        public RequisitionModels? Requisition { get; set; }

        public int StepOrder { get; set; }   

        public string Status { get; set; }   // Pending, Approved, Rejected

        public DateTime? ActionDate { get; set; }

        public string? Remarks { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
