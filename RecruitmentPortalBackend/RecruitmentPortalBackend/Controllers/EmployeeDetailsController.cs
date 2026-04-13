using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentPortalBackend.Data;
using RecruitmentPortalBackend.Models;
namespace RecruitmentPortalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeDetailsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmployeeDetailsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetEmployees()
        {
            var employees = _context.EmployeeDetails
                .Select(e => new { EmpID = e.EmpID, EmpName = e.EmpName, Designation = e.Designation, Level = e.Level })
                .ToList();
            return Ok(employees);
        }
    }
}
