using System.Threading.Tasks;
using Abp.Application.Services;
using SavageRuler.Sessions.Dto;

namespace SavageRuler.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
