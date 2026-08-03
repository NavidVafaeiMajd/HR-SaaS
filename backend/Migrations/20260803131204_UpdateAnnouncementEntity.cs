using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HrSaaS.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAnnouncementEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "AnnouncementUsers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_AnnouncementUsers_UserId",
                table: "AnnouncementUsers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AnnouncementPositions_PositionId",
                table: "AnnouncementPositions",
                column: "PositionId");

            migrationBuilder.CreateIndex(
                name: "IX_AnnouncementDepartments_DepartmentId",
                table: "AnnouncementDepartments",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnnouncementDepartments_Departments_DepartmentId",
                table: "AnnouncementDepartments",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnnouncementPositions_Positions_PositionId",
                table: "AnnouncementPositions",
                column: "PositionId",
                principalTable: "Positions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnnouncementUsers_AspNetUsers_UserId",
                table: "AnnouncementUsers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnnouncementDepartments_Departments_DepartmentId",
                table: "AnnouncementDepartments");

            migrationBuilder.DropForeignKey(
                name: "FK_AnnouncementPositions_Positions_PositionId",
                table: "AnnouncementPositions");

            migrationBuilder.DropForeignKey(
                name: "FK_AnnouncementUsers_AspNetUsers_UserId",
                table: "AnnouncementUsers");

            migrationBuilder.DropIndex(
                name: "IX_AnnouncementUsers_UserId",
                table: "AnnouncementUsers");

            migrationBuilder.DropIndex(
                name: "IX_AnnouncementPositions_PositionId",
                table: "AnnouncementPositions");

            migrationBuilder.DropIndex(
                name: "IX_AnnouncementDepartments_DepartmentId",
                table: "AnnouncementDepartments");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "AnnouncementUsers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
