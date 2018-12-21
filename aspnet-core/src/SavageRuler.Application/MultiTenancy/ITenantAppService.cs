using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SavageRuler.MultiTenancy.Dto;

namespace SavageRuler.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

