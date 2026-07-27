using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HrSaaS.Migrations
{
    /// <inheritdoc />
    public partial class UpdateShiftEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Start",
                table: "ShiftsTime",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "End",
                table: "ShiftsTime",
                newName: "EndTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "ShiftsTime",
                newName: "Start");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "ShiftsTime",
                newName: "End");
        }
    }
}
