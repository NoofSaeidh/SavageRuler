using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SavageRuler.Migrations
{
    public partial class Add_Powers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Powers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    ExtensionData = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 64, nullable: false),
                    Book = table.Column<string>(nullable: true),
                    Points = table.Column<string>(nullable: true),
                    Duration = table.Column<string>(nullable: true),
                    Distance = table.Column<string>(nullable: true),
                    Rank = table.Column<string>(nullable: true),
                    Trappings = table.Column<string>(nullable: true),
                    Text = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Powers", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Powers");
        }
    }
}
