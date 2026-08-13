using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HrSaaS.Migrations
{
    /// <inheritdoc />
    public partial class AddPayRollEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmployeeSalaries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BaseSalary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HousingAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FoodAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TransportationAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ChildAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SeniorityAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LatePerHour = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LeavePerDay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AbsentPerDay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OvertimePerHour = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Tax = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Insurance = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EffectiveFrom = table.Column<DateOnly>(type: "date", nullable: false),
                    EffectiveTo = table.Column<DateOnly>(type: "date", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeSalaries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmployeeSalaries_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeSalaryHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeSalaryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BaseSalary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HousingAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FoodAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TransportationAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ChildAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SeniorityAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LatePerHour = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LeavePerDay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AbsentPerDay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OvertimePerHour = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Tax = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Insurance = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EffectiveFrom = table.Column<DateOnly>(type: "date", nullable: false),
                    EffectiveTo = table.Column<DateOnly>(type: "date", nullable: true),
                    ChangeReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeSalaryHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmployeeSalaryHistories_EmployeeSalaries_EmployeeSalaryId",
                        column: x => x.EmployeeSalaryId,
                        principalTable: "EmployeeSalaries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSalaries_UserId",
                table: "EmployeeSalaries",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSalaryHistories_EmployeeSalaryId",
                table: "EmployeeSalaryHistories",
                column: "EmployeeSalaryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmployeeSalaryHistories");

            migrationBuilder.DropTable(
                name: "EmployeeSalaries");
        }
    }
}
