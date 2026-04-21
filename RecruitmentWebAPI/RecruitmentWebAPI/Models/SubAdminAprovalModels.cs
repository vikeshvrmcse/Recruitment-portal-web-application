namespace RecruitmentWebAPI.Models
{
    public class SubAdminAprovalModels
    {
        public string? Id { get; set; } //Primary Key
        public string? SubAdminId { get; set; }
        public required EmployeeDetails EmployeeDetailsDatas { get; set; }
        public int RequisitionId { get; set; }
        public required RequisitionModels RequisitionDatas { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
