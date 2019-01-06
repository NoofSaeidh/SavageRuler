using Abp.Extensions;
using Abp.Localization.Sources;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Localization
{
    public static class LocalizationExtensions
    {
        public static IDictionary<string, string> ToStringsDictionary(this ILocalizationSource typeSource, CultureInfo culture, bool toCamelCase = true, bool includeDefaults = true)
        {
            if(!toCamelCase)
                return typeSource.GetAllStrings(culture, includeDefaults).ToDictionary(s => s.Name, s => s.Value);
            return typeSource.GetAllStrings(culture, includeDefaults).ToDictionary(s => s.Name.ToCamelCase(), s => s.Value);
        }

        public static IDictionary<string, string> ToStringsDictionary(this ILocalizationSource typeSource, bool toCamelCase = true, bool includeDefaults = true)
        {
            return ToStringsDictionary(typeSource, CultureInfo.CurrentUICulture, toCamelCase, includeDefaults);
        }
    }
}
