using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HrSaaS.Migrations
{
    /// <inheritdoc />
    public partial class AddInceraseSalary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SalaryIncreaseRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CurrentBaseSalary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RequestedBaseSalary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IncreaseAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IncreasePercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EffectiveYear = table.Column<int>(type: "int", nullable: false),
                    EffectiveMonth = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ApprovedById = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalaryIncreaseRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SalaryIncreaseRequests_AspNetUsers_ApprovedById",
                        column: x => x.ApprovedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SalaryIncreaseRequests_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SalaryIncreaseRequests_ApprovedById",
                table: "SalaryIncreaseRequests",
                column: "ApprovedById");

            migrationBuilder.CreateIndex(
                name: "IX_SalaryIncreaseRequests_UserId",
                table: "SalaryIncreaseRequests",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SalaryIncreaseRequests");
        }
    }
}
