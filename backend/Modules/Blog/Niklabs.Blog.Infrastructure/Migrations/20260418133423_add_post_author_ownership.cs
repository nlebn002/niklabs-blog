using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Niklabs.Blog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class add_post_author_ownership : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AuthorUserId",
                table: "Posts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Posts_AuthorUserId",
                table: "Posts",
                column: "AuthorUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Posts_AuthorUserId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "AuthorUserId",
                table: "Posts");
        }
    }
}
