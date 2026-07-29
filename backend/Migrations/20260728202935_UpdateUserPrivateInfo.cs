using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HrSaaS.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserPrivateInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Biography_BiographyId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_EmergencyCall_EmergencyCallId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_SocialMedia_SocialMediaId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_BiographyId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_EmergencyCallId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_SocialMediaId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "SocialMedia",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "EmergencyCall",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Biography",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "SocialMediaId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmergencyCallId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BiographyId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SocialMedia_UserId",
                table: "SocialMedia",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyCall_UserId",
                table: "EmergencyCall",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Biography_UserId",
                table: "Biography",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Biography_AspNetUsers_UserId",
                table: "Biography",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EmergencyCall_AspNetUsers_UserId",
                table: "EmergencyCall",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SocialMedia_AspNetUsers_UserId",
                table: "SocialMedia",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Biography_AspNetUsers_UserId",
                table: "Biography");

            migrationBuilder.DropForeignKey(
                name: "FK_EmergencyCall_AspNetUsers_UserId",
                table: "EmergencyCall");

            migrationBuilder.DropForeignKey(
                name: "FK_SocialMedia_AspNetUsers_UserId",
                table: "SocialMedia");

            migrationBuilder.DropIndex(
                name: "IX_SocialMedia_UserId",
                table: "SocialMedia");

            migrationBuilder.DropIndex(
                name: "IX_EmergencyCall_UserId",
                table: "EmergencyCall");

            migrationBuilder.DropIndex(
                name: "IX_Biography_UserId",
                table: "Biography");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "SocialMedia",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "EmergencyCall",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Biography",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "SocialMediaId",
                table: "AspNetUsers",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "EmergencyCallId",
                table: "AspNetUsers",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "BiographyId",
                table: "AspNetUsers",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_BiographyId",
                table: "AspNetUsers",
                column: "BiographyId",
                unique: true,
                filter: "[BiographyId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_EmergencyCallId",
                table: "AspNetUsers",
                column: "EmergencyCallId",
                unique: true,
                filter: "[EmergencyCallId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_SocialMediaId",
                table: "AspNetUsers",
                column: "SocialMediaId",
                unique: true,
                filter: "[SocialMediaId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Biography_BiographyId",
                table: "AspNetUsers",
                column: "BiographyId",
                principalTable: "Biography",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_EmergencyCall_EmergencyCallId",
                table: "AspNetUsers",
                column: "EmergencyCallId",
                principalTable: "EmergencyCall",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_SocialMedia_SocialMediaId",
                table: "AspNetUsers",
                column: "SocialMediaId",
                principalTable: "SocialMedia",
                principalColumn: "Id");
        }
    }
}
