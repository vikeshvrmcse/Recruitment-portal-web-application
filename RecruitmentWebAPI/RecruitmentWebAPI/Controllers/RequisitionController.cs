using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentWebAPI.Data;
using RecruitmentWebAPI.Models;

namespace RecruitmentWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequisitionController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public RequisitionController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/Requisition
        [HttpGet]
        public IActionResult GetRequisitionAll()
        {
            var requisitions = _context.Requisitions
                .AsNoTracking()
                .ToList();

            return Ok(requisitions);
        }

        // GET: api/Requisition/{id}
        [HttpGet("{id}")]
        public IActionResult GetRequisitionById(string id)
        {
            var requisition = _context.Requisitions
                .AsNoTracking()
                .FirstOrDefault(r => r.Id == id);

            if (requisition == null)
            {
                return NotFound($"Requisition with Id {id} not found");
            }

            return Ok(requisition);
        }

        //GET: api/Requisition/userTL/{userId}
        [HttpGet("userTL/{userId}")]
        public IActionResult GetTLRequisitionsByUser(string userId)
        {
            var data = _context.Requisitions
                .AsNoTracking()
                .Where(r => r.EmpID == userId)
                .ToList();

            return Ok(data);
        }

        [HttpPost]
        public IActionResult CreateRequisition([FromBody] RequisitionModels model)
        {
            if (model == null)
            {
                return BadRequest("Invalid requisition data");
            }

            
            var employeeExists = _context.EmployeeDetails
                .Any(e => e.EmpID == model.EmpID);

            if (!employeeExists)
            {
                return NotFound("Employee not found for given EmpID");
            }

            model.Id = Guid.NewGuid().ToString();
            model.CreatedAt = DateTime.Now;
            model.UpdatedAt = DateTime.Now;

            _context.Requisitions.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Requisition created successfully",
                data = model
            });
        }

        [HttpGet("with-employee/{id}")]
        public async Task<IActionResult> GetRequisitionWithEmployeeById(string id)
        {
            var data = await (from r in _context.Requisitions
                              join e in _context.EmployeeDetails
                              on r.EmpID equals e.EmpID
                              where r.EmpID == id
                              select new
                              {
                                  r,
                                  Employee = new
                                  {
                                      e.EmpID,
                                      e.IRB,
                                      e.EmpName,
                                      e.Designation,
                                      e.Dept,
                                      e.MailID
                                  }
                              })
                              .FirstOrDefaultAsync();

            if (data == null)
                return NotFound("Record not found");
            return Ok(data);
        }


        [HttpGet("with-employee-by-irb/{irb}")]
        public async Task<IActionResult> GetRequisitionByIRB(string irb)
        {
            
            var data = await (from r in _context.Requisitions
                              join e in _context.EmployeeDetails
                              on r.EmpID equals e.EmpID
                              where e.IRB == irb
                              select new
                              {
                                  r,
                                  Employee = new
                                  {
                                      e.EmpID,
                                      e.IRB,
                                      e.EmpName,
                                      e.Designation,
                                      e.Dept,
                                      e.MailID
                                  }
                              })
                              .ToListAsync();

            if (data == null || !data.Any())
                return NotFound(new
                {
                    success = false,
                    message = "No requisition found for this IRB"
                });

            return Ok(data);
        }

        [HttpGet("with-employee-by-id/{id}")]
        public async Task<IActionResult> GetApprovedRequisition(string id)
        {
                

            var data = await (
                from req in _context.Requisitions

                join app in _context.RequisitionApprovalModels
                    on req.Id equals app.RequisitionID into gj
                from subApp in gj.DefaultIfEmpty()

                join emp in _context.EmployeeDetails
                    on subApp.EmpID equals emp.EmpID into empJoin
                from verifier in empJoin.DefaultIfEmpty()

                where req.EmpID == id

                select new
                {
                    //Requisition fields
                    Id = req.Id,
                    CreatedAt = req.CreatedAt,
                    JobTitle = req.JobTitle,
                    RequisitionReason = req.RequisitionReason,
                    Requirements = req.Requirements,
                    RequisitionDepartment=req.Department,
                    HighestQualification=req.HighestQualification,
                    JobType=req.JobType,
                    Department = req.Department,
                    Location = req.Location,
                    Description=req.Description,
                    Skills = req.Skills,
                    year_of_experience = req.YearOfExperience,
                    EmpID = req.EmpID,
                    Deadline=req.Deadline,
                    Vacancy = req.Vacancy,
                    YearOfExperience=req.YearOfExperience,
                    
                    Status = subApp != null ? subApp.PreviousStatus : "pending",

                    
                    VerifiedBy = (verifier != null && verifier.Level == "L1")
                                    ? verifier.EmpName
                                    : null,

            
                    VerifiedAt = subApp != null
                                    ? subApp.CreatedAt
                                    : (DateTime?)null
                }
            ).ToListAsync();

            

            return Ok(data);
        }


        [HttpGet("track/{empId}")]
        public async Task<IActionResult> GetFullTracking(string empId)
        {
            
            var requisitions = await _context.Requisitions
                .Where(r => r.EmpID == empId)
                .ToListAsync();

            var requisitionIds = requisitions.Select(r => r.Id).ToList();

            
            var approvals = await (
                from ra in _context.RequisitionApprovalModels
                join e1 in _context.EmployeeDetails
                    on ra.EmpID equals e1.EmpID into emp1
                from e1 in emp1.DefaultIfEmpty()

                join e2 in _context.EmployeeDetails
                    on ra.NextEmpID equals e2.EmpID into emp2
                from e2 in emp2.DefaultIfEmpty()

                where requisitionIds.Contains(ra.RequisitionID)

                select new
                {
                    ra.RequisitionID,
                    ra.Id,
                    ActionBy = e1 != null ? e1.EmpName : "System",
                    NextApprover = e2 != null ? e2.EmpName : "N/A",
                    Status = ra.CurrentStatus,
                    Date = ra.CreatedAt,
                    Type = "Approval"
                }
            ).ToListAsync();

           
            var result = requisitions.Select(r =>
            {
                var steps = new List<object>();

              
                steps.Add(new
                {
                    Id = r.Id,
                    ActionBy = "System",
                    NextApprover = "First Approver",
                    Status = "created",
                    Date = r.CreatedAt,
                    Type = "Requisition"
                });

                
                var approvalSteps = approvals
                    .Where(a => a.RequisitionID == r.Id)
                    .OrderBy(a => a.Date)
                    .Select((a, index) => new
                    {
                        a.Id,
                        a.ActionBy,
                        a.NextApprover,
                        Status =
                            a.Status == "approved" ? "confirmed" :
                            a.Status == "rejected" ? "cancelled" :
                            "review",
                        a.Date,
                        StepNumber = index + 2,
                        a.Type
                    });

                steps.AddRange(approvalSteps);

                return new
                {
                    RequisitionID = r.Id,
                    JobTitle = r.JobTitle,
                    CreatedBy = r.EmpID,
                    CreatedAt = r.CreatedAt,
                    Status = r.Status,

                    Steps = steps.OrderBy(s => ((dynamic)s).Date)
                };
            });

            return Ok(result);
        }

        [HttpGet("RequisitionTracker")]
        public async Task<IActionResult> GetRequisitionStatusFlow(string empID)
        {
           
            var employee = await _context.EmployeeDetails
                .FirstOrDefaultAsync(x => x.EmpID == empID);

            if (employee == null)
                return NotFound("Employee not found");

  
            var requisitions = await _context.Requisitions
                .Where(x => x.EmpID == empID)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            if (!requisitions.Any())
                return NotFound("No requisitions found");

            var result = new List<object>();

            foreach (var requisition in requisitions)
            {
                
                var approvals = await _context.RequisitionApprovalModels
                    .Where(x => x.RequisitionID == requisition.Id)
                    .OrderBy(x => x.CreatedAt)
                    .ToListAsync();

                var flow = new List<object>();

                
                flow.Add(new
                {
                    stepType = "Requisition Created",
                    requisitionId = requisition.Id,
                    actionBy = employee.EmpName,
                    status = requisition.Status,
                    date = requisition.CreatedAt
                });

               
                foreach (var item in approvals)
                {
                    var actionBy = await _context.EmployeeDetails
                        .FirstOrDefaultAsync(x => x.EmpID == item.EmpID);

                    var nextApprover = await _context.EmployeeDetails
                        .FirstOrDefaultAsync(x => x.EmpID == item.NextEmpID);

                    flow.Add(new
                    {
                        stepType = "Approval Step",
                        requisitionId = item.RequisitionID,
                        actionBy = actionBy?.EmpName,
                        nextApprover = nextApprover?.EmpName,
                        status =
                            item.CurrentStatus == "approved" ? "confirmed" :
                            item.CurrentStatus == "rejected" ? "cancelled" :
                            "review",
                        rawStatus = item.CurrentStatus,
                        date = item.CreatedAt
                    });
                }

                result.Add(new
                {
                    requisitionId = requisition.Id,
                    requisitionTitle = requisition.JobTitle,
                    status = requisition.Status,
                    createdAt = requisition.CreatedAt,
                    flow
                });
            }

            return Ok(result);
        }

    }
}