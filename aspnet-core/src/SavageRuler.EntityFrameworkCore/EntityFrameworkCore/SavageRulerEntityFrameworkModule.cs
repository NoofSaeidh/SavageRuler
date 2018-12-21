using Abp.EntityFrameworkCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using SavageRuler.EntityFrameworkCore.Seed;

namespace SavageRuler.EntityFrameworkCore
{
    [DependsOn(
        typeof(SavageRulerCoreModule), 
        typeof(AbpZeroCoreEntityFrameworkCoreModule))]
    public class SavageRulerEntityFrameworkModule : AbpModule
    {
        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }

        public bool SkipDbSeed { get; set; }

        public override void PreInitialize()
        {
            if (!SkipDbContextRegistration)
            {
                Configuration.UnitOfWork.IsTransactional = false;
                Configuration.Modules.AbpEfCore().AddDbContext<SavageRulerDbContext>(options =>
                {
                    if (options.ExistingConnection != null)
                    {
                        SavageRulerDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                    }
                    else
                    {
                        SavageRulerDbContextConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                    }
                });
            }
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SavageRulerEntityFrameworkModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            if (!SkipDbSeed)
            {
                SeedHelper.SeedHostDb(IocManager);
            }
        }
    }
}
