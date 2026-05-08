using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using RecruitmentWebAPI.Data;
using RecruitmentWebAPI.Models;
using System;

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
            request.CurrentStatus = "pending";

            Console.WriteLine(request.PreviousStatus);
            Console.WriteLine(request.NextEmpID);
            Console.WriteLine(request.CurrentStatus);
            //var entity = _context.RequisitionApprovalModels.FirstOrDefault(x => x.RequisitionId == request.RequisitionId);
            _context.RequisitionApprovalModels.Add(request);
            _context.SaveChanges();
            return Ok(new
            {
                message = "Status updated successfully",
                data = request
            });
        }
        [HttpPost("RequisitionStatusUpdateWithNextUpdator")]
        public IActionResult RequisitionStatusUpdateWithNextUpdator([FromBody] RequisitionApprovalModel request)
        {
            if (request == null)
                return BadRequest("Invalid request");
            // Example logic
            // Update database here
            request.Id = Guid.NewGuid().ToString(); // since Id is string
            request.CreatedAt = DateTime.Now;
            //request.CurrentStatus = "pending";

            //Console.WriteLine(request.PreviousStatus);
            //Console.WriteLine(request.NextEmpID);
            //Console.WriteLine(request.CurrentStatus);
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
                            Status = a != null ? r.PreviousStatus : "Pending"
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

        [HttpGet("ForNextEmployee")]
        public async Task<IActionResult> ForNextEmployee(string empId)
        {
            var approverName = _context.EmployeeDetails.AsNoTracking()
                .FirstOrDefault(r => r.EmpID == empId);
            if (approverName == null)
            {
                return NotFound("User is not found");
            }
            var data = await (
                from approval in _context.RequisitionApprovalModels
                join req in _context.Requisitions
                    on approval.RequisitionID equals req.Id
                join emp in _context.EmployeeDetails
                    on req.EmpID equals emp.EmpID

                join irbEmp in _context.EmployeeDetails
                    on emp.IRB equals irbEmp.EmpID into irbGroup
                from irbEmp in irbGroup.DefaultIfEmpty()

                where approval.NextEmpID == empId
                      && approval.PreviousStatus == "approved"

                select new
                {
                    //Approval Info
                    ApprovalId = approval.Id,
                    approval.RequisitionID,
                    CurrentApprover = approval.EmpID,
                    ApproverName = irbEmp.EmpName,
                    NextApprover = approval.NextEmpID,
                    PreviousStatus = approval.PreviousStatus,
                    CurrentStatus = approval.CurrentStatus,
                    //EmpName=approval.EmpName

                    //Requisition Info
                    req.Id,
                    req.JobTitle,
                    req.Description,
                    req.Department,
                    req.CreatedAt,
                    req.Deadline,
                    req.Vacancy,

                    //Created By
                    CreatedByEmpID = emp.EmpID,
                    CreatedByName = emp.EmpName,
                    emp.MailID,
                    emp.Dept,
                    emp.Designation
                }
            ).ToListAsync();

            return Ok(data);
        }
        [HttpGet("ForNextEmployeeByAdmin")]
        public async Task<IActionResult> ForNextEmployeeByAdmin(string empId)
        {
            var approverName = _context.EmployeeDetails.AsNoTracking()
                .FirstOrDefault(r => r.EmpID == empId);
            if (approverName == null)
            {
                return NotFound("User is not found");
            }
            var data = await (
                from approval in _context.RequisitionApprovalModels
                join req in _context.Requisitions
                    on approval.RequisitionID equals req.Id
                join emp in _context.EmployeeDetails
                    on req.EmpID equals emp.EmpID

                join irbEmp in _context.EmployeeDetails
                    on emp.IRB equals irbEmp.EmpID into irbGroup
                from irbEmp in irbGroup.DefaultIfEmpty()

                where approval.NextEmpID == empId
                      && approval.PreviousStatus == "approved" && approval.CurrentStatus != "approved"

                select new
                {
                    //Approval Info
                    ApprovalId = approval.Id,
                    approval.RequisitionID,
                    CurrentApprover = approval.EmpID,
                    ApproverName = irbEmp.EmpName,
                    NextApprover = approval.NextEmpID,
                    PreviousStatus = approval.PreviousStatus,
                    CurrentStatus = approval.CurrentStatus,
                    //EmpName=approval.EmpName

                    //Requisition Info
                    req.Id,
                    req.JobTitle,
                    req.Description,
                    req.Department,
                    req.CreatedAt,
                    req.Deadline,
                    req.Vacancy,

                    //Created By
                    CreatedByEmpID = emp.EmpID,
                    CreatedByName = emp.EmpName,
                    emp.MailID,
                    emp.Dept,
                    emp.Designation
                }
            ).ToListAsync();

            return Ok(data);
        }
        [HttpGet("ForNextEmployeeByAdminForMunjal")]
        public async Task<IActionResult> ForNextEmployeeByAdminForMunjal(string empId)
        {
            var approverName = _context.EmployeeDetails.AsNoTracking()
                .FirstOrDefault(r => r.EmpID == empId);
            if (approverName == null)
            {
                return NotFound("User is not found");
            }
            var data = await (
                from approval in _context.RequisitionApprovalModels
                join req in _context.Requisitions
                    on approval.RequisitionID equals req.Id
                join emp in _context.EmployeeDetails
                    on req.EmpID equals emp.EmpID

                join irbEmp in _context.EmployeeDetails
                    on emp.IRB equals irbEmp.EmpID into irbGroup
                from irbEmp in irbGroup.DefaultIfEmpty()

                join mnemp in _context.EmployeeDetails on approval.EmpID equals mnemp.EmpID

                where approval.NextEmpID == empId
                      && (approval.PreviousStatus == "approved" && approval.CurrentStatus == "approved")

                select new
                {
                    //Approval Info
                    ApprovalId = approval.Id,
                    approval.RequisitionID,
                    CurrentApprover = mnemp.EmpName,
                    ApproverName = irbEmp.EmpName,
                    NextApprover = approval.NextEmpID,
                    PreviousStatus = approval.PreviousStatus,
                    CurrentStatus = approval.CurrentStatus,
                    //EmpName=approval.EmpName

                    //Requisition Info
                    req.Id,
                    req.JobTitle,
                    req.Description,
                    req.Department,
                    req.CreatedAt,
                    req.Deadline,
                    req.Vacancy,

                    //Created By
                    CreatedByEmpID = emp.EmpID,
                    CreatedByName = emp.EmpName,
                    emp.MailID,
                    emp.Dept,
                    emp.Designation
                }
            ).ToListAsync();

            return Ok(data);
        }
        [HttpGet("ForNextEmployeeApprovedStatus")]
        public async Task<IActionResult> ForNextEmployeeApprovedStatus(string empId)
        {
            var approverName = _context.EmployeeDetails.AsNoTracking().FirstOrDefault(r => r.EmpID == empId);
            if (approverName == null)
            {
                return NotFound("User is not found");
            }
            var data = await (
                from approval in _context.RequisitionApprovalModels
                join req in _context.Requisitions
                    on approval.RequisitionID equals req.Id
                join emp in _context.EmployeeDetails
                    on req.EmpID equals emp.EmpID
                join irbEmp in _context.EmployeeDetails
                    on emp.IRB equals irbEmp.EmpID into irbGroup
                from irbEmp in irbGroup.DefaultIfEmpty()

                where approval.EmpID == empId
                      && approval.PreviousStatus == "approved"
                      && (approval.CurrentStatus == "approved" || approval.CurrentStatus == "rejected")

                orderby approval.CreatedAt descending

                select new
                {
                    ApprovalId = approval.Id,
                    approval.RequisitionID,
                    CurrentApprover = approval.EmpID,
                    ApproverName = irbEmp.EmpName,
                    NextApprover = approval.NextEmpID,
                    PreviousStatus = approval.PreviousStatus,
                    CurrentStatus = approval.CurrentStatus,

                    req.Id,
                    req.JobTitle,
                    req.Description,
                    req.Department,
                    req.CreatedAt,
                    req.Deadline,
                    req.Vacancy,

                    CreatedByEmpID = emp.EmpID,
                    CreatedByName = emp.EmpName,
                    emp.MailID,
                    emp.Dept,
                    emp.Designation
                }).GroupBy(x => x.RequisitionID).Select(g => g.First()).ToListAsync();

            return Ok(data);
        }
        [HttpGet("ForNextMainAdminApprovedStatus")]
        public async Task<IActionResult> ForNextMainAdminApprovedStatus(string empId)
        {
            var approverName = _context.EmployeeDetails.AsNoTracking().FirstOrDefault(r => r.EmpID == empId);
            if (approverName == null)
            {
                return NotFound("User is not found");
            }
            var data = await (
                from approval in _context.RequisitionApprovalModels
                join req in _context.Requisitions
                    on approval.RequisitionID equals req.Id
                join emp in _context.EmployeeDetails
                    on req.EmpID equals emp.EmpID
                join irbEmp in _context.EmployeeDetails
                    on emp.IRB equals irbEmp.EmpID into irbGroup
                from irbEmp in irbGroup.DefaultIfEmpty()

                where approval.EmpID == empId
                      && approval.PreviousStatus == "approved"
                      && (approval.CurrentStatus == "approved" || approval.CurrentStatus == "rejected") && approval.NextEmpID == empId

                orderby approval.CreatedAt descending

                select new
                {
                    ApprovalId = approval.Id,
                    approval.RequisitionID,
                    CurrentApprover = approval.EmpID,
                    ApproverName = irbEmp.EmpName,
                    NextApprover = approval.NextEmpID,
                    PreviousStatus = approval.PreviousStatus,
                    CurrentStatus = approval.CurrentStatus,

                    req.Id,
                    req.JobTitle,
                    req.Description,
                    req.Department,
                    req.CreatedAt,
                    req.Deadline,
                    req.Vacancy,

                    CreatedByEmpID = emp.EmpID,
                    CreatedByName = emp.EmpName,
                    emp.MailID,
                    emp.Dept,
                    emp.Designation
                }).GroupBy(x => x.RequisitionID).Select(g => g.First()).ToListAsync();

            return Ok(data);
        }

        [HttpGet("ForNextEmployeeForMunjalApproval")]
        public async Task<IActionResult> ForNextEmployeeForMunjalApproval(string empId)
        {
            var baseQuery = (
                from approval in _context.RequisitionApprovalModels
                join req in _context.Requisitions
                    on approval.RequisitionID equals req.Id
                join emp in _context.EmployeeDetails
                    on req.EmpID equals emp.EmpID

                join irbEmp in _context.EmployeeDetails
                    on emp.IRB equals irbEmp.EmpID into irbGroup
                from irbEmp in irbGroup.DefaultIfEmpty()

                select new
                {
                    ApprovalId = approval.Id,
                    approval.RequisitionID,
                    CurrentApprover = approval.EmpID,
                    ApproverName = irbEmp.EmpName,
                    NextApprover = approval.NextEmpID,
                    PreviousStatus = approval.PreviousStatus,
                    CurrentStatus = approval.CurrentStatus,

                    req.Id,
                    req.JobTitle,
                    req.Description,
                    req.Department,
                    req.CreatedAt,
                    req.Deadline,
                    req.Vacancy,

                    CreatedByEmpID = emp.EmpID,
                    CreatedByName = emp.EmpName,
                    emp.MailID,
                    emp.Dept,
                    emp.Designation
                }
            );

            var pendingForMe = await baseQuery
                .Where(x => x.NextApprover == empId && x.PreviousStatus == "approved")
                .ToListAsync();

            var myApprovals = await baseQuery
                .Where(x => x.CurrentApprover == empId)
                .ToListAsync();

            var completed = await baseQuery
                .Where(x => x.CurrentStatus == "approved" || x.CurrentStatus == "rejected")
                .ToListAsync();

            return Ok(new
            {
                pendingForMe,
                myApprovals,
                completed
            });
        }


        [HttpGet("GetUniqueEmployeesWithStatus")]
        public async Task<IActionResult> GetUniqueEmployeesWithStatus(string id, string status)
        {
            var selectData = await (
                from data in _context.RequisitionVerifierModels
                where data.EmpID == id
                      && data.Status == status
                join req in _context.Requisitions
                    on data.RequisitionID equals req.Id
                join emp in _context.EmployeeDetails
                    on req.EmpID equals emp.EmpID
                join approver in _context.EmployeeDetails
                    on data.EmpID equals approver.EmpID

                select new
                {
                    approver,
                    creator = emp,
                    requisition = req
                }
            ).ToListAsync();

            var result = new
            {
                approvedBy = selectData
                    .Select(x => new
                    {
                        x.approver.EmpID,
                        x.approver.EmpName,
                        x.approver.Designation
                    })
                    .FirstOrDefault(),

                creator = selectData
                    .GroupBy(x => x.creator.EmpID)
                    .Select(g => new
                    {
                        creator_employee = new
                        {
                            g.First().creator.EmpID,
                            g.First().creator.EmpName,
                            g.First().creator.Designation,
                            g.First().creator.Dept,
                            g.First().creator.CompanyLocation
                        },

                        requisition = g.Select(x => new
                        {
                            x.requisition.Id,
                            x.requisition.JobTitle,
                            x.requisition.Department,
                            x.requisition.Description,
                            x.requisition.Status,
                            x.requisition.CreatedAt,
                            x.requisition.Vacancy,
                            x.requisition.Location
                        }).ToList()
                    })
                    .ToList()
            };

            return Ok(result);
        }


        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] ImprovedRequisitionApprovalModel model)
        {
            if (model == null)
                return BadRequest("Invalid data");

            // Validate duplicate step
            var exists = await _context.RequisitionVerifierModels
                .AnyAsync(x =>
                    x.RequisitionID == model.RequisitionID &&
                    x.StepOrder == model.StepOrder);

            if (exists)
                return BadRequest("Step already exists");

            model.Id = Guid.NewGuid().ToString();
            model.CreatedAt = DateTime.UtcNow;
            model.UpdatedAt = DateTime.UtcNow;

            // First step = Pending, others = Waiting
            var isFirst = !await _context.RequisitionVerifierModels
                .AnyAsync(x => x.RequisitionID == model.RequisitionID);

            //model.Status = isFirst ? "created" : "pending";

            _context.RequisitionVerifierModels.Add(model);
            await _context.SaveChangesAsync();

            return Ok(model);
        }



        [HttpGet("chain/{reqId}")]
        public async Task<IActionResult> GetChain(string reqId)
        {
            var data = await _context.RequisitionVerifierModels
                .Where(x => x.RequisitionID == reqId)
                .OrderBy(x => x.StepOrder)
                .ToListAsync();

            return Ok(data);
        }


        [HttpPost("approve")]
        public async Task<IActionResult> Approve(string reqId, string userId)
        {
            // Get current pending step
            var current = await _context.RequisitionVerifierModels
                .Where(x => x.RequisitionID == reqId && x.Status == "pending")
                .OrderBy(x => x.StepOrder)
                .FirstOrDefaultAsync();

            if (current == null)
                return BadRequest("No pending step");

            // Validate user
            if (current.EmpID != userId)
                return BadRequest("Unauthorized");

            // Approve current
            current.Status = "approved";
            current.ActionDate = DateTime.UtcNow;
            current.UpdatedAt = DateTime.UtcNow;

            // Get next step
            var next = await _context.RequisitionVerifierModels
                .FirstOrDefaultAsync(x =>
                    x.RequisitionID == reqId &&
                    x.StepOrder == current.StepOrder + 1);

            if (next != null)
            {
                next.Status = "pending";
                next.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                var req = await (from data in _context.RequisitionVerifierModels where data.Id == reqId select new { data }).FirstOrDefaultAsync();
                Console.WriteLine(req);
                if (req != null)
                    req.data.Status = "approved";
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Approved successfully",
                stepOrder = current?.StepOrder
            });
        }

        [HttpPost("reject")]
        public async Task<IActionResult> Reject(string reqId, string userId, string remarks)
        {
            var current = await _context.RequisitionVerifierModels
                .Where(x => x.RequisitionID == reqId && x.Status == "pending")
                .OrderBy(x => x.StepOrder)
                .FirstOrDefaultAsync();

            if (current == null)
                return BadRequest("No pending step");

            if (current.EmpID != userId)
                return BadRequest("Unauthorized");

            current.Status = "rejected";
            current.Remarks = remarks;
            current.ActionDate = DateTime.UtcNow;

            var req = await _context.Requisitions
                .FirstOrDefaultAsync(r => r.Id == reqId);

            if (req != null)
                req.Status = "rejected";

            await _context.SaveChangesAsync();

            return Ok("Rejected successfully");
        }

        [HttpGet("pending/{userId}")]
        public async Task<IActionResult> GetPending(string userId)
        {
            var data = await _context.RequisitionVerifierModels
                .Where(x => x.EmpID == userId && x.Status == "pending")
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("approved/{userId}")]
        public async Task<IActionResult> GetApproved(string userId)
        {
            var data = await _context.RequisitionVerifierModels
                .Where(x => x.EmpID == userId && x.Status == "approved")
                .OrderByDescending(x => x.ActionDate)
                .ToListAsync();

            return Ok(data);
        }

        //[HttpGet("GetApprovedRequisitions")]
        //public async Task<IActionResult> GetApprovedRequisitions(string empId)
        //{
        //    var data = await _context.RequisitionVerifierModels
        //        .Include(r => r.Requisition)
        //        .Where(r => r.EmpID == empId && r.Status == "approved")
        //        .Select(r => new
        //        {
        //            r.RequisitionID,
        //            r.StepOrder,
        //            r.Status,
        //            r.ActionDate,
        //            RequisitionTitle = r.Requisition.JobTitle
        //        })
        //        .ToListAsync();

        //    return Ok(data);
        //}
        //[HttpGet("GetRejectedRequisitions")]
        //public async Task<IActionResult> GetRejectedRequisitions(string empId)
        //{
        //    var data = await _context.RequisitionVerifierModels
        //        .Include(r => r.Requisition)
        //        .Where(r => r.EmpID == empId && r.Status == "pending")
        //        .Select(r => new
        //        {
        //            r.RequisitionID,
        //            r.StepOrder,
        //            r.Status,
        //            r.ActionDate,
        //            RequisitionTitle = r.Requisition.JobTitle
        //        })
        //        .ToListAsync();

        //    return Ok(data);
        //}

        //[HttpPost("RequisitionApproveByIRB")]
        //public IActionResult Approve(string previousId, string reqId, string userId, int stepOrder)
        //{
        //    var current = _context.RequisitionVerifierModels
        //        .FirstOrDefault(x =>
        //            x.RequisitionID == reqId &&
        //            x.StepOrder == stepOrder &&
        //            x.EmpID == previousId);

        //    if (current == null)
        //        return BadRequest("Invalid approval step");

        //    //current.Status = "approved";
        //    //current.ActionDate = DateTime.Now;

        //    var next = _context.RequisitionVerifierModels
        //        .FirstOrDefault(x =>
        //            x.RequisitionID == reqId &&
        //            x.StepOrder == stepOrder + 1);

        //    if (next != null)
        //    {
        //        next.Status = "pending";
        //        next.EmpID = userId;
        //    }
        //    else
        //    {
        //        var req = _context.Requisitions
        //            .FirstOrDefault(r => r.Id == reqId);

        //        req.Status = "approved";
        //    }

        //    _context.SaveChanges();

        //    return Ok("Approved successfully");
        //}

        //[HttpPost("Approve")]
        //public IActionResult Approve(string reqId, string userId)
        //{
        //    var current = _context.RequisitionVerifierModels
        //        .FirstOrDefault(x => x.RequisitionID == reqId && x.EmpID == userId);

        //    current.Status = "approved";
        //    current.ActionDate = DateTime.Now;

        //    var next = _context.RequisitionVerifierModels
        //        .FirstOrDefault(x =>
        //            x.RequisitionID == reqId &&
        //            x.StepOrder == current.StepOrder + 1);

        //    if (next != null)
        //    {
        //        next.Status = "pending";

        //        //_notificationService.Notify(new NotificationDto
        //        //{
        //        //    UserId = next.EmpID,
        //        //    Title = "Approval Required",
        //        //    Message = $"Requisition {reqId} is waiting for your approval"
        //        //});
        //    }
        //    else
        //    {
        //        var req = _context.Requisitions
        //            .FirstOrDefault(r => r.Id == reqId);

        //        req.Status = "approved";
        //    }

        //    _context.SaveChanges();

        //    return Ok("Approved and next user notified");
        //}


        [HttpGet("GetRequisitionDetails/{empId}")]
        public IActionResult GetRequisitionDetails(string empId)
        {
            var result = (from ed in _context.EmployeeDetails
                          join rvm in _context.RequisitionVerifierModels
                              on ed.EmpID equals rvm.EmpID
                          join r in _context.Requisitions
                              on rvm.RequisitionID equals r.Id
                          join em in _context.EmployeeDetails
                              on r.EmpID equals em.EmpID
                          join e in _context.EmployeeDetails
                              on r.EmpID equals e.EmpID
                          join es in _context.EmployeeDetails
                              on e.IRB equals es.EmpID
                          join er in _context.EmployeeDetails
                              on es.IRB equals er.EmpID
                          where ed.EmpID == empId
                          select new
                          {
                              //CreatorDetails
                              Name = em.EmpName,
                              Designation = em.Designation,
                              Department = em.Dept,

                              //RequisitionDetails
                              RequisitionID = r.Id,
                              JobTitle = r.JobTitle,
                              Description = r.Description,
                              RequisitionReason = r.RequisitionReason,
                              Requirements = r.Requirements,
                              RequisitionDepartment = r.Department,
                              JobType = r.JobType,
                              Location = r.Location,
                              YearOfExperience = r.YearOfExperience,
                              HighestQualification = r.HighestQualification,
                              Vacancy = r.Vacancy,
                              Deadline = r.Deadline,
                              CreatedAt = r.CreatedAt,
                              Status = rvm.Status,
                              Skills = r.Skills,

                              //ApprovarDetails
                              ApprovedByLevel1 = es.EmpName,
                              ApprovedByLevel2 = er.EmpName,
                              FinalApprovar = ed.EmpName
                          }).ToList();

            return Ok(result);
        }


        [HttpGet("employee-chain/{empId}")]
        public async Task<IActionResult> GetEmployeeChain(string empId)
        {
            var result = new List<object>();
            var visited = new HashSet<string>(); // prevent infinite loop

            var currentEmpId = empId;
            int level = 1;
            string chainPath = "";

            while (!string.IsNullOrEmpty(currentEmpId) && !visited.Contains(currentEmpId))
            {
                var emp = await _context.EmployeeDetails
                    .Where(e => e.EmpID == currentEmpId)
                    .Select(e => new { e.EmpID, e.IRB })
                    .FirstOrDefaultAsync();

                if (emp == null)
                    break;

                visited.Add(emp.EmpID);

                chainPath = string.IsNullOrEmpty(chainPath)
                    ? emp.EmpID
                    : chainPath + " -> " + emp.EmpID;

                result.Add(new
                {
                    EmpID = emp.EmpID,
                    IRB = emp.IRB,
                    ChainPath = chainPath,
                    LevelFDD = level
                });

                currentEmpId = emp.IRB; // move to next
                level++;
            }

            return Ok(result);
        }


        [HttpGet("GetRequisitionByIRBFromImprove/{irb}")]
        public async Task<IActionResult> GetRequisitionByIRBFromImprove(string irb)
        {
            // -------------------------------
            // 1. BUILD IRB CHAIN
            // -------------------------------
            var chain = new List<string>();
            var visited = new HashSet<string>();

            var current = irb;

            while (!string.IsNullOrEmpty(current) && visited.Add(current))
            {
                chain.Add(current);

                current = await _context.EmployeeDetails
                    .Where(x => x.EmpID == current)
                    .Select(x => x.IRB)
                    .FirstOrDefaultAsync();
            }

            // -------------------------------
            // 2. LOAD EMPLOYEE CACHE
            // -------------------------------
            var employeeMap = await _context.EmployeeDetails
                .ToDictionaryAsync(x => x.EmpID, x => new
                {
                    x.EmpName,
                    x.Designation,
                    x.Dept
                });

            // -------------------------------
            // 3. GET BASE DATA (ONLY DB)
            // -------------------------------
            var baseData = await (
             from a in _context.RequisitionVerifierModels
             join e in _context.EmployeeDetails on a.EmpID equals e.EmpID
             join r in _context.Requisitions on a.RequisitionID equals r.Id
             where a.EmpID == irb orderby r.CreatedAt descending

             join c in _context.EmployeeDetails
                 on r.EmpID equals c.EmpID

             select new
             {
                 a.RequisitionID,
                 a.EmpID,
                 //Status = _context.RequisitionVerifierModels
                 //                           .Where(rvm => r.Id == rvm.RequisitionID)
                                            
                 //                           .Select(rvm =>
                 //                                rvm.Status
                 //                           )
                 //                           .FirstOrDefault(),
                 a.Status,
                 a.CreatedAt,

                 EmpName = e.EmpName,

                 Creator = new
                 {
                     c.EmpName,
                     c.Designation,
                     c.Dept
                 },

                 RequisitionDetails = new
                 {
                     r.CreatedAt,
                     r.Deadline,
                     r.JobTitle,
                     r.Skills,
                     r.ExperienceLevel,
                     r.Description,
                     r.Department,
                     r.ReqType,
                     r.JobType,
                     r.HighestQualification,
                     r.RequisitionReason,
                     r.Requirements,
                     r.Location,
                     r.YearOfExperience,
                     r.Vacancy
                 }
             }).ToListAsync();

            // -------------------------------
            // 4. LOAD VERIFIER DATA
            // -------------------------------
            var reqIds = baseData.Select(x => x.RequisitionID).ToList();

            var verifiers = await _context.RequisitionVerifierModels
                .Where(x => reqIds.Contains(x.RequisitionID))
                .ToListAsync();

            var verifierMap = verifiers
                .ToDictionary(x => (x.RequisitionID, x.EmpID), x => x);

            // -------------------------------
            // 5. FINAL RESPONSE (C# SIDE LOGIC)
            // -------------------------------
            var result = baseData.Select(a => new
            {
                a.RequisitionID,
                a.EmpID,
                a.Status,
                a.CreatedAt,
                a.EmpName,
                a.RequisitionDetails,

                Creator = a.Creator,

                Requisitions = chain.Select((emp, index) =>
                {
                    verifierMap.TryGetValue((a.RequisitionID, emp), out var record);

                    employeeMap.TryGetValue(emp, out var empInfo);

                    return new
                    {
                        EmpID = emp,
                        EmpName = empInfo?.EmpName,

                        Status = record?.Status == null ? "Pending" : record.Status,
                        CreatedAt = record?.CreatedAt,
                        UpdatedAt = record?.UpdatedAt,
                        ActionDate = record?.ActionDate,

                        StepOrder = index
                    };
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        [HttpGet("GetRequisitionChain/{empId}")]
        public async Task<IActionResult> GetRequisitionChain(string empId)
        {
            // -------------------------------
            // 1. Build IRB chain (workflow path)
            // -------------------------------
            var chain = new List<string>();
            var visited = new HashSet<string>();
            var current = empId;

            while (!string.IsNullOrEmpty(current) && visited.Add(current))
            {
                chain.Add(current);

                current = await _context.EmployeeDetails
                    .Where(x => x.EmpID == current)
                    .Select(x => x.IRB)
                    .FirstOrDefaultAsync();
            }

            // -------------------------------
            // 2. Load requisitions (minimal fields)
            // -------------------------------
            var requisitions = await _context.Requisitions
                .Where(x => x.EmpID == empId)
                .Select(r => new
                {
                    r.Id,
                    r.JobTitle,
                    r.Department
                })
                .ToListAsync();

            var reqIds = requisitions.Select(r => r.Id).ToList();

            // -------------------------------
            // 3. Load verifier data only for these requisitions
            // -------------------------------
            var verifiers = await _context.RequisitionVerifierModels
                .Where(v => reqIds.Contains(v.RequisitionID))
                .ToListAsync();

            // -------------------------------
            // 4. Create fast lookup (RequisitionID + EmpID)
            // -------------------------------
            var verifierMap = verifiers.ToDictionary(
                x => (x.RequisitionID, x.EmpID),
                x => x
            );

            // -------------------------------
            // 5. Build final workflow response
            // -------------------------------
            var result = new List<object>();

            foreach (var req in requisitions)
            {
                var workflow = new List<object>();

                for (int i = 0; i < chain.Count; i++)
                {
                    var emp = chain[i];

                    verifierMap.TryGetValue((req.Id, emp), out var record);

                    workflow.Add(new
                    {
                        EmpID = emp,
                        Status = record?.Status ?? "Pending",
                        CreatedAt = record?.CreatedAt,
                        UpdatedAt = record?.UpdatedAt,
                        ActionDate = record?.ActionDate,

                        // AUTO STEP ORDER (0 → N)
                        StepOrder = i
                    });
                }

                result.Add(new
                {
                    RequisitionID = req.Id,
                    req.JobTitle,
                    req.Department,
                    Workflow = workflow
                });
            }

            return Ok(result);
        }


        [HttpGet("employee-requisition-chain/{reqId}")]
        public async Task<IActionResult> GetEmployeerRequisitionChain(string reqId)
        {
            var reqData = await _context.Requisitions.Where(e => e.Id == reqId).Select(x => new { x }).FirstOrDefaultAsync();
            var result = new List<object>();
            var visited = new HashSet<string>(); // prevent infinite loop




            var currentEmpId = reqData?.x?.EmpID;
            int level = 1;
            string chainPath = "";

            while (!string.IsNullOrEmpty(currentEmpId) && !visited.Contains(currentEmpId))
            {
                var emp = await _context.EmployeeDetails
                    .Where(e => e.EmpID == currentEmpId)
                    .Select(e => new { e.EmpID, e.IRB, e.EmpName })
                    .FirstOrDefaultAsync();

                if (emp == null)
                    break;

                visited.Add(emp.EmpID);

                chainPath = string.IsNullOrEmpty(chainPath)
                    ? emp.EmpID
                    : chainPath + " -> " + emp.EmpID;

                var getApproveData = await _context.RequisitionVerifierModels.Where(x => x.EmpID == emp.EmpID && x.RequisitionID == reqId).Select(x => new { x }).FirstOrDefaultAsync();

                result.Add(new
                {
                    EmpID = emp.EmpID,
                    EmpName = emp.EmpName,
                    IRB = emp.IRB,
                    ChainPath = chainPath,
                    StepOrder = level,
                    Status = getApproveData?.x?.Status,
                    UpdatedAt = getApproveData?.x?.UpdatedAt
                });

                currentEmpId = emp.IRB; // move to next
                level++;
            }

            return Ok(result);
        }

    }
}
