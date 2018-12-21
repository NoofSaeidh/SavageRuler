using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler
{
    public class SavageRulerEntity : FullAuditedEntity, IExtendableObject, IPassivable
    {
        public virtual bool IsActive { get; set; } = true;
        public virtual string ExtensionData { get; set; }
    }
}
