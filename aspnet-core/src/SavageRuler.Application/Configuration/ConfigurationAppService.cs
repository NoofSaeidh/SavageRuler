using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using SavageRuler.Configuration.Dto;

namespace SavageRuler.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : SavageRulerAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
