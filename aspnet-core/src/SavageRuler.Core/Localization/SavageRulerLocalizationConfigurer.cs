using Abp.Configuration.Startup;
using Abp.Localization;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;
using SavageRuler.Extensions;
using SavageRuler.Rules.Powers;
using System.Linq;

namespace SavageRuler.Localization
{
    public static class SavageRulerLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Languages.AddMany(
                new LanguageInfo("en", "English", "famfamfam-flag-us"),
                new LanguageInfo("ru", "Russian", "famfamfam-flag-ru", true)
            );

            localizationConfiguration.Sources.Add(
                GetXmlSource(
                    SavageRulerConsts.Localization.SourceName,
                    "SavageRuler.Localization.SourceFiles.Default"
                )
            );


            localizationConfiguration.Sources.AddMany(
                GetXmlSourceForTypes("SavageRuler.Localization.SourceFiles.Type",
                    nameof(Power)
                )
            );
        }

        private static DictionaryBasedLocalizationSource GetXmlSource(string name, string rootNamespace)
        {
            return new DictionaryBasedLocalizationSource(name,
                new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(SavageRulerLocalizationConfigurer).GetAssembly(),
                        rootNamespace
                )
            );
        }

        private static DictionaryBasedLocalizationSource[] GetXmlSourceForTypes(string rootNamespace, params string[] typeNames)
        {
            return typeNames
                .Select(type =>
                    new DictionaryBasedLocalizationSource(
                        SavageRulerConsts.Localization.GetTypeSourceName(type),
                        new XmlEmbeddedFileLocalizationTypeDictionaryProvider(
                            typeof(SavageRulerLocalizationConfigurer).GetAssembly(),
                            rootNamespace
                        )
                    )
                )
                .ToArray();
        }
    }
}
