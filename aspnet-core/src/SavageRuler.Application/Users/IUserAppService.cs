using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SavageRuler.Roles.Dto;
using SavageRuler.Users.Dto;

namespace SavageRuler.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>
    {
        Task<ListResultDto<RoleDto>> GetRoles();

        Task ChangeLanguage(ChangeUserLanguageDto input);
    }
}
