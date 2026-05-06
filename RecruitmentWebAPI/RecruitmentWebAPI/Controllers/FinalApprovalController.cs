using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentWebAPI.Data;

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

                var collect = new
                {
                    CreatorName = employee?.EmpName,
                    VerifierName = verifierEmpNamef?.EmpName,
                    Status = getApproveData?.Status,
                    CreatedAt = getUser?.CreatedAt,
                    UpdatedAt = getApproveData?.UpdatedAt
                };

                jsonData.Add(collect);
            }

            return Ok(new
            {
                Data = jsonData,
                Message = "All data fetched successfully"
            });
        }
    }
}
