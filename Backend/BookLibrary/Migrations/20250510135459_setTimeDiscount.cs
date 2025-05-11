using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookLibrary.Migrations
{
    /// <inheritdoc />
    public partial class setTimeDiscount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DiscountEndDate",
                table: "Books",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercentage",
                table: "Books",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DiscountStartDate",
                table: "Books",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountEndDate",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "DiscountPercentage",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "DiscountStartDate",
                table: "Books");
        }
    }
}
