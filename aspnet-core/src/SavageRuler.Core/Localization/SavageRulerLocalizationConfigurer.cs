using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace SavageRuler.Localization
{
    public static class SavageRulerLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(SavageRulerConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(SavageRulerLocalizationConfigurer).GetAssembly(),
                        "SavageRuler.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
