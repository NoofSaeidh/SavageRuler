using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Localization
{
    public interface ILocalizablePropertiesAppService
    {
        IDictionary<string, string> GetLocalizedProperties();
    }
}
