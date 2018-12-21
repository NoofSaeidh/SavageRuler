using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using SavageRuler.Authorization;

namespace SavageRuler
{
    [DependsOn(
        typeof(SavageRulerCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class SavageRulerApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<SavageRulerAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(SavageRulerApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddProfiles(thisAssembly)
            );
        }
    }
}
