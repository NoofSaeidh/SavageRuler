using System.Threading.Tasks;
using SavageRuler.Configuration.Dto;

namespace SavageRuler.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
