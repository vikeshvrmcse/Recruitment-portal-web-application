using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentWebAPI.Data;
using RecruitmentWebAPI.Models;

namespace RecruitmentWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeDetailsController : ControllerBase
    {
        private readonly ApplicationDBContext context;
        public EmployeeDetailsController(ApplicationDBContext _context)
        {
            context = _context;
        }

        [HttpGet]
        public IActionResult GetEmployees()
        {
            var employees = context.EmployeeDetails.ToList();
            return Ok(employees);
        }

        [HttpPost("GetUser")]
        public IActionResult SigninEmployees([FromBody] EmployeeSigninModel model)
        {
            var employee = context.EmployeeDetails.FirstOrDefault(x => model.EmpID == x.EmpID);

            if (employee == null)
            {
                return Unauthorized(new {Message = "User not found", Success=false});
            }
            if (employee.Password != model.Password)
            {
                return Unauthorized(new { Message = "Credential are invalid", Success = false });
            }
            return Ok(new { Message = "Login successfull", Data = employee, Success = true });
        }
    }
}
