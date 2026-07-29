using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HrSaaS.Migrations
{
    /// <inheritdoc />
    public partial class editUserEntity3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BiographyId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "EmergencyCallId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SocialMediaId",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BiographyId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmergencyCallId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SocialMediaId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
