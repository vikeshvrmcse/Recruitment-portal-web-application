using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentWebAPI.Data;
using RecruitmentWebAPI.Models;

namespace RecruitmentWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinalApprovalController : ControllerBase
    {
        public readonly ApplicationDBContext _context;

        public FinalApprovalController(ApplicationDBContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllFinalApprovalData()
        {
            var data = await _context.RequisitionVerifierModels
                .Where(x => x.EmpID == "PMA0001" && x.Status == "done")
                .ToListAsync();

            if (!data.Any())
            {
                return NotFound(new
                {
                    Data = data,
                    Message = "No data found"
                });
            }

            

            List<object> jsonData = new List<object>();

            foreach (var item in data)
            {
                var getUser = await _context.Requisitions
                    .FirstOrDefaultAsync(x => x.Id == item.RequisitionID);

                if (getUser == null) continue;

                var employee = await _context.EmployeeDetails
                    .FirstOrDefaultAsync(x => x.EmpID == getUser.EmpID);

                var getApproveData = await _context.RequisitionVerifierModels
                    .FirstOrDefaultAsync(x => x.Id == item.Id);

                var verifierEmpNamef = await _context.EmployeeDetails
                    .FirstOrDefaultAsync(x => x.IRB == getApproveData.EmpID);

                var getHRSeen = await _context.HRActionModels.Where(x => x.ApprovalID==getApproveData.Id).Select(x=>x).FirstOrDefaultAsync();



                var collect = new
                {
                    CreatorName = employee?.EmpName,
                    VerifierName = verifierEmpNamef?.EmpName,
                    ApprovalID = getApproveData.Id,
                    RequisitionTitle = getUser.JobTitle,
                    RequisitionDeadline = getUser.Deadline,
                    RequisitionID = getApproveData.RequisitionID,
                    Status = getApproveData?.Status,
                    CreatedAt = getUser?.CreatedAt,
                    UpdatedAt = getApproveData?.UpdatedAt,
                    Seen = getHRSeen?.Seen ?? false,
                    AssignedToEmpID = getHRSeen?.Seen==true ? getHRSeen.AssignedToEmpID : "",
                    MainId =getHRSeen?.Id??"",
                    //pdatedAt = getApproveData.UpdatedAt
                };

                jsonData.Add(collect);
            }

            return Ok(new
            {
                Data = jsonData,
                Message = "All data fetched successfully"
            });
        }


        [HttpPost("FinalHRAction")]
        public async Task<IActionResult> FinalHRAction([FromBody] HRActionModels model)
        {
            if (model == null)
            {
                return BadRequest(new
                {
                    Message = "Invalid data",
                    Success = false
                });
            }

            // Example validation
            if (string.IsNullOrEmpty(model.RequisitionID))
            {
                return BadRequest(new
                {
                    Message = "RequisitionID is required",
                    Success = false
                });
            }

            model.Seen = false;
            model.Id = Guid.NewGuid().ToString();

            await _context.HRActionModels.AddAsync(model);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "HR Action saved successfully",
                Success = true,
                Data = model
            });
        }

        [HttpGet("GetHRActionSeen/{empId}")]
        public async Task<IActionResult> GetHRActionSeen(string empId)
        {
            
            var data = await _context.HRActionModels.Where(x => x.AssignedToEmpID == empId).Select(x=>x).ToListAsync();

            List<object> jsonData = new List<object>();

            foreach(var item in data)
            {
                var apprData = await _context.RequisitionVerifierModels
                                .Where(x => x.Id == item.ApprovalID)
                                .Select(x => new
                                {
                                    Employee = _context.EmployeeDetails
                                        .FirstOrDefault(a => a.IRB == x.EmpID),
                                    Status=x.Status,
                                    UpdatedAt=x.UpdatedAt
                                })
                                .FirstOrDefaultAsync();
                var reqData = await _context.Requisitions.Where(x => x.Id == item.RequisitionID).Select(x => x).FirstOrDefaultAsync();
                var senderData = await _context.EmployeeDetails.Where(x => x.EmpID == item.AssignedByEmpID).Select(x => x).FirstOrDefaultAsync();
                var creator = await _context.EmployeeDetails.Where(x => x.EmpID == reqData.EmpID).Select(x => x).FirstOrDefaultAsync();

                var collect = new
                {
                    Id=item.Id,
                    approvalID= item.ApprovalID,
                    RequisitionTitle=reqData.JobTitle,
                    requisitionApproval= apprData,
                    requisitionDeadline=reqData.Deadline,
                    requisitionID= item.RequisitionID,
                    requisition= reqData,
                    assignedByEmpID=item.AssignedByEmpID,
                    assignedBy = senderData,
                    assignedToEmpID=item.AssignedToEmpID,
                    seen= item.Seen,
                    completedAt= item.CompletedAt,
                    createdAt= item.CreatedAt,
                    Creator = creator,

                    Status=apprData.Status,
                    updatedAt = apprData.UpdatedAt
                };      

                jsonData.Add(collect);
            }
            if (jsonData == null)
            {
                return NotFound(new { Data = jsonData, Message = "Not found any data" });
            }
            return Ok(new { Data = jsonData });
        }

        [HttpPut("HRActionSeenBySubHr/{id}")]
        public async Task<IActionResult> HRActionSeenBySubHr(string id)
        {
            // Find particular data
            var seenData = await _context.HRActionModels.FindAsync(id);

            // Check if data exists
            if (seenData == null)
            {
                return NotFound(new
                {
                    message = "Data not found"
                });
            }

            // Update field
            seenData.Seen = true;

            // Optional updated time
            seenData.UpdatedAt = DateTime.UtcNow;

            // Save changes
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Updated successfully",
                data = seenData
            });
        }
    }
}
