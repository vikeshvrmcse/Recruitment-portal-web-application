using System;
using System.Collections.Generic;

namespace RecruitmentWebAPI.Models;

public partial class EmployeeDetail
{
    public string EmpId { get; set; } = null!;

    public string? EmpName { get; set; }

    public string? MailId { get; set; }

    public string? Designation { get; set; }

    public string? Level { get; set; }

    public string? Irb { get; set; }

    public string? Dept { get; set; }

    public double? AdvanceAmount { get; set; }

    public string? Password { get; set; }

    public string? Status { get; set; }

    public string? CompanyLocation { get; set; }
}
