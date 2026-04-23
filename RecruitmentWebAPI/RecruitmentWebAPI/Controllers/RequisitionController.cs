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

            // Optional: check if Employee exists
            var employeeExists = _context.EmployeeDetails
                .Any(e => e.EmpID == model.EmpID);

            if (!employeeExists)
            {
                return NotFound("Employee not found for given EmpID");
            }

            model.Id = Guid.NewGuid().ToString(); // since Id is string
            model.CreatedAt = DateTime.Now;

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
                //var checkExistId = _context.Requisitions.FirstOrDefault(x => x.EmpID == id);
                //if (checkExistId == null)
                //{
                //    return Ok(new { success = false, message = "No data found" });
                //}

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
                    //Final Status
                    Status = subApp != null ? subApp.PreviousStatus : "pending",

                    //Verifier Info (ONLY L1)
                    VerifiedBy = (verifier != null && verifier.Level == "L1")
                                    ? verifier.EmpName
                                    : null,

                    //Verification Date
                    VerifiedAt = subApp != null
                                    ? subApp.CreatedAt
                                    : (DateTime?)null
                }
            ).ToListAsync();

            //if (data == null || !data.Any())
            //    return NotFound(new
            //    {
            //        success = false,
            //        message = "No requisition approvals found"
            //    });

            return Ok(data);
        }
        
    }
}