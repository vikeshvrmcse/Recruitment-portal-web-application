using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentWebAPI.Data;
using RecruitmentWebAPI.Migrations;
using RecruitmentWebAPI.Models;

namespace RecruitmentWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubAdminAprovalController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public SubAdminAprovalController(ApplicationDBContext context)
        {
            _context = context;
        }
        //[HttpGet]
        //public IActionResult GetSubAdminAllApprovals()
        //{
        //    var SubAdmin = _context.SubAdminModels.ToList();
        //    return Ok(SubAdmin);
        //}

        //[HttpGet("userSubAdmin/{userId}")]
        //public IActionResult GetSubAdminRequisitionsByUser(string? userId)
        //{
        //    var data = _context.SubAdminModels
        //        .Include(s => s.RequisitionDatas)
        //        .Where(s => s.RequisitionDatas != null && s.RequisitionDatas.EmpID == userId)
        //        .ToList();

        //    if (!data.Any())
        //    {
        //        return NotFound("No records found.");
        //    }

        //    return Ok(data);
        //}

        [HttpGet("with-employee")]
        public IActionResult GetRequisitionsWithEmployee()
        {
            var data = (from r in _context.Requisitions
                        join e in _context.EmployeeDetails
                        on r.EmpID equals e.EmpID
                        select new
                        {
                            r.Id,
                            r.JobTitle,
                            r.Department,
                            r.Status,
                            r.EmpID,
                            Employee = new
                            {
                                e.EmpID,
                                e.EmpName,
                                e.Designation,
                                e.Dept,
                                e.MailID
                            }
                        }).ToList();

            return Ok(data);
        }

        [HttpPost("RequisitionStatusUpdate")]
            public IActionResult RequisitionStatusUpdate([FromBody] RequisitionApprovalModel request)
            {
                if (request == null)
                    return BadRequest("Invalid request");
            // Example logic
            // Update database here
            request.Id = Guid.NewGuid().ToString(); // since Id is string
            request.CreatedAt = DateTime.Now;
            //var entity = _context.RequisitionApprovalModels.FirstOrDefault(x => x.RequisitionId == request.RequisitionId);
            _context.RequisitionApprovalModels.Add(request);
            _context.SaveChanges();
            return Ok(new
                {
                    message = "Status updated successfully",
                    data = request
                });
            }

        [HttpGet("GetByEmpID/{empID}")]
        public IActionResult GetByEmpID(string empID)
        {
            var data = (from r in _context.RequisitionApprovalModels
                        join a in _context.Requisitions
                        on r.RequisitionID equals a.Id into ra
                        from a in ra.DefaultIfEmpty()
                        where r.EmpID == empID
                        select new
                        {
                            r.Id,
                            r.EmpID,
                            r.RequisitionID,
                            Status = a != null ? r.Status : "Pending"
                        }).ToList();

            return Ok(data);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateRequisition([FromBody] RequisitionModels request)
        {
            if (request == null)
                return BadRequest("Invalid request");

            var existing = await _context.Requisitions
                .FirstOrDefaultAsync(x => x.Id == request.Id);

            if (existing == null)
                return NotFound("Requisition not found");

            // UPDATE ALL FIELDS
            existing.CreatedAt = request.CreatedAt;
            existing.Deadline = request.Deadline;
            existing.Department = request.Department;
            existing.Description = request.Description;
            existing.EmpID = request.EmpID;
            existing.HighestQualification = request.HighestQualification;
            existing.JobTitle = request.JobTitle;
            existing.JobType = request.JobType;
            existing.Location = request.Location;
            existing.ReqType = request.ReqType;
            existing.Requirements = request.Requirements;
            existing.RequisitionReason = request.RequisitionReason;
            existing.Status = request.Status;
            existing.Vacancy = request.Vacancy;
            existing.YearOfExperience = request.YearOfExperience;

            // IMPORTANT: Handle List<string>
            existing.Skills = request.Skills ?? new List<string>();
            existing.ExperienceLevel = request.ExperienceLevel ?? new List<string>();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Updated successfully",
                data = existing
            });
        }
    }
}
