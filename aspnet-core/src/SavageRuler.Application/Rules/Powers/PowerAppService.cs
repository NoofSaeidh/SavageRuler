using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using SavageRuler.Rules.Powers.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Rules.Powers
{
    public class PowerAppService : AsyncCrudAppService<Power, PowerDto, int, PowerListDto>, 
        IPowerAppService
    {
        public PowerAppService(IRepository<Power, int> repository) : base(repository)
        {
        }
    }
}
