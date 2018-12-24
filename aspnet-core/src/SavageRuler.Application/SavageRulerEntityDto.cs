using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler
{
    public class SavageRulerEntityDto : FullAuditedEntityDto, IExtendableObject, IPassivable
    {
        public virtual string ExtensionData { get; set; }
        public virtual bool IsActive { get; set; } = true;

    }
}
