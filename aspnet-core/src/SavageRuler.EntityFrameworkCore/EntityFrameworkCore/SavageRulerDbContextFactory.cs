using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using SavageRuler.Configuration;
using SavageRuler.Web;

namespace SavageRuler.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class SavageRulerDbContextFactory : IDesignTimeDbContextFactory<SavageRulerDbContext>
    {
        public SavageRulerDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<SavageRulerDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            SavageRulerDbContextConfigurer.Configure(builder, configuration.GetConnectionString(SavageRulerConsts.ConnectionStringName));

            return new SavageRulerDbContext(builder.Options);
        }
    }
}
