using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace SavageRuler.EntityFrameworkCore
{
    public static class SavageRulerDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<SavageRulerDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<SavageRulerDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
