using Abp.Application.Services;
using SavageRuler.Localization;
using SavageRuler.Rules.Powers.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Rules.Powers
{
    public interface IPowerAppService : 
        IAsyncCrudAppService<PowerDto, int, PowerListDto>, 
        ILocalizablePropertiesAppService
    {
    }
}
