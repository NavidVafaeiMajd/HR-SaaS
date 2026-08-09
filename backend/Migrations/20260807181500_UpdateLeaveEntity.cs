using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HrSaaS.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLeaveEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attachment",
                table: "LeaveRequests");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "LeaveRequests");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "LeaveRequests");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "LeaveRequests",
                newName: "Reason");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Reason",
                table: "LeaveRequests",
                newName: "Description");

            migrationBuilder.AddColumn<string>(
                name: "Attachment",
                table: "LeaveRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "EndTime",
                table: "LeaveRequests",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "StartTime",
                table: "LeaveRequests",
                type: "time",
                nullable: true);
        }
    }
}
