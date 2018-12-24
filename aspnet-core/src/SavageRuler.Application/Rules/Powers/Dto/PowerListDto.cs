using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Rules.Powers.Dto
{
    public class PowerListDto : EntityDto
    {
        public string Name { get; set; }
        public string Book { get; set; }
        public string Points { get; set; }
        public string Duration { get; set; }
        public string Distance { get; set; }
        public string Rank { get; set; }
        public string Trappings { get; set; }
        public string Text { get; set; }
    }
}
