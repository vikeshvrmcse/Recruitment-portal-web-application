using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmployeeDetails",
                columns: table => new
                {
                    EmpID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    EmpName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    MailID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Designation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Level = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IRB = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Dept = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AdvanceAmount = table.Column<double>(type: "float", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CompanyLocation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccessLevel = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeDetails", x => x.EmpID);
                });

            migrationBuilder.CreateTable(
                name: "Requisitions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Deadline = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmpID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmployeeDetailsID = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    ExperienceLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HighestQualification = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JobTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JobType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReqType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Requirements = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequisitionReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Skills = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Vacancy = table.Column<int>(type: "int", nullable: false),
                    YearOfExperience = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Requisitions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Requisitions_EmployeeDetails_EmployeeDetailsID",
                        column: x => x.EmployeeDetailsID,
                        principalTable: "EmployeeDetails",
                        principalColumn: "EmpID");
                });

            migrationBuilder.CreateTable(
                name: "RequisitionApprovalModels",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EmpID = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    RequisitionID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    NextEmpID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreviousStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CurrentStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequisitionApprovalModels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RequisitionApprovalModels_EmployeeDetails_EmpID",
                        column: x => x.EmpID,
                        principalTable: "EmployeeDetails",
                        principalColumn: "EmpID");
                    table.ForeignKey(
                        name: "FK_RequisitionApprovalModels_Requisitions_RequisitionID",
                        column: x => x.RequisitionID,
                        principalTable: "Requisitions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RequisitionApprovalModels_EmpID",
                table: "RequisitionApprovalModels",
                column: "EmpID");

            migrationBuilder.CreateIndex(
                name: "IX_RequisitionApprovalModels_RequisitionID",
                table: "RequisitionApprovalModels",
                column: "RequisitionID");

            migrationBuilder.CreateIndex(
                name: "IX_Requisitions_EmployeeDetailsID",
                table: "Requisitions",
                column: "EmployeeDetailsID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RequisitionApprovalModels");

            migrationBuilder.DropTable(
                name: "Requisitions");

            migrationBuilder.DropTable(
                name: "EmployeeDetails");
        }
    }
}
