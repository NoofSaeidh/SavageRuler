using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using SavageRuler.Configuration;

namespace SavageRuler.Web.Client.Startup
{
    [DependsOn(
       typeof(SavageRulerWebCoreModule))]
    public class SavageRulerWebClientModule: AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public SavageRulerWebClientModule(IHostingEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(SavageRulerWebClientModule).GetAssembly());
        }
    }
}
