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
        //public required EmployeeDetails EmployeeDetailDatas { get; set; }
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
    }


    public class RequisitionApprovalModel
    {
        public string? Id { get; set; } //Primary Key
        public DateTime CreatedAt { get; set; }
        public required string EmpID { get; set; }
        public required string RequisitionID { get; set; }
        public required string NextEmpID { get; set; }
        public required string PreviousStatus { get; set; }
        public string? CurrentStatus { get; set; }
    }

   
}
