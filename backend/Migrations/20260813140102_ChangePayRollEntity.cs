using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HrSaaS.Migrations
{
    /// <inheritdoc />
    public partial class ChangePayRollEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EffectiveFrom",
                table: "EmployeeSalaryHistories");

            migrationBuilder.DropColumn(
                name: "EffectiveTo",
                table: "EmployeeSalaryHistories");

            migrationBuilder.DropColumn(
                name: "EffectiveFrom",
                table: "EmployeeSalaries");

            migrationBuilder.DropColumn(
                name: "EffectiveTo",
                table: "EmployeeSalaries");

            migrationBuilder.AddColumn<int>(
                name: "EffectiveMonth",
                table: "EmployeeSalaryHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EffectiveYear",
                table: "EmployeeSalaryHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EffectiveMonth",
                table: "EmployeeSalaries",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EffectiveYear",
                table: "EmployeeSalaries",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EffectiveMonth",
                table: "EmployeeSalaryHistories");

            migrationBuilder.DropColumn(
                name: "EffectiveYear",
                table: "EmployeeSalaryHistories");

            migrationBuilder.DropColumn(
                name: "EffectiveMonth",
                table: "EmployeeSalaries");

            migrationBuilder.DropColumn(
                name: "EffectiveYear",
                table: "EmployeeSalaries");

            migrationBuilder.AddColumn<DateOnly>(
                name: "EffectiveFrom",
                table: "EmployeeSalaryHistories",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateOnly>(
                name: "EffectiveTo",
                table: "EmployeeSalaryHistories",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "EffectiveFrom",
                table: "EmployeeSalaries",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateOnly>(
                name: "EffectiveTo",
                table: "EmployeeSalaries",
                type: "date",
                nullable: true);
        }
    }
}
