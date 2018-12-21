using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using SavageRuler.Configuration;

namespace SavageRuler.Web.Host.Startup
{
    [DependsOn(
       typeof(SavageRulerWebCoreModule))]
    public class SavageRulerWebHostModule: AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public SavageRulerWebHostModule(IHostingEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SavageRulerWebHostModule).GetAssembly());
        }
    }
}
