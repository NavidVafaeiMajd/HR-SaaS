using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HrSaaS.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserSalary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccountHolderName",
                table: "EmployeeSalaries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AccountNumber",
                table: "EmployeeSalaries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BankName",
                table: "EmployeeSalaries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CardNumber",
                table: "EmployeeSalaries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShebaNumber",
                table: "EmployeeSalaries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountHolderName",
                table: "EmployeeSalaries");

            migrationBuilder.DropColumn(
                name: "AccountNumber",
                table: "EmployeeSalaries");

            migrationBuilder.DropColumn(
                name: "BankName",
                table: "EmployeeSalaries");

            migrationBuilder.DropColumn(
                name: "CardNumber",
                table: "EmployeeSalaries");

            migrationBuilder.DropColumn(
                name: "ShebaNumber",
                table: "EmployeeSalaries");
        }
    }
}
