using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentWebAPI.Models
{
    public class HRActionModels
    {
        [Key]
        public string? Id { get; set; }
        public string? ApprovalID { get; set; } //Foreign Key
        [ForeignKey(nameof(ApprovalID))]
        public ImprovedRequisitionApprovalModel? RequisitionApproval { get; set; }
        public string? RequisitionID { get; set; } //Foreign Key
        [ForeignKey(nameof(RequisitionID))]
        public RequisitionModels? Requisition { get; set; }
        public string? AssignedByEmpID { get; set; } //Foreign Key
        [ForeignKey(nameof(AssignedByEmpID))]
        public EmployeeDetails? AssignedBy { get; set; }
        public string? AssignedToEmpID { get; set; } //Foreign Key
        [ForeignKey(nameof(AssignedToEmpID))]
        public EmployeeDetails? AssignedTo { get; set; }
        public bool? Seen { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
