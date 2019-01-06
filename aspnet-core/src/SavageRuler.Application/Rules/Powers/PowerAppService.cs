using Abp;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Localization.Sources;
using SavageRuler.Localization;
using SavageRuler.Rules.Powers.Dto;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Rules.Powers
{
    public class PowerAppService :
        SavageRulerCrudAppServiceBase<Power, PowerDto, int, PowerListDto, PowerDto, PowerDto, EntityDto<int>, EntityDto<int>>,
        IPowerAppService
    {
        public PowerAppService(IRepository<Power, int> repository) : base(repository)
        {
        }
    }
}
