using Abp.Auditing;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Rules.Powers
{
    [Audited]
    public class Power : SavageRulerEntity
    {
        [Required(AllowEmptyStrings = true), MaxLength(64)]
        public virtual string Name { get; set; }
        public virtual string Book { get; set; }
        public virtual string Points { get; set; }
        public virtual string Duration { get; set; }
        public virtual string Distance { get; set; }
        public virtual string Rank { get; set; }
        public virtual string Trappings { get; set; }
        public virtual string Text { get; set; }
    }
}
