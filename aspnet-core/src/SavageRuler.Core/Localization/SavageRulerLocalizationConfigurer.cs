using Abp.Configuration.Startup;
using Abp.Localization;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;
using SavageRuler.Extensions;
using SavageRuler.Rules.Powers;

namespace SavageRuler.Localization
{
    public static class SavageRulerLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Languages.AddMany(
                new LanguageInfo("en", "English", "famfamfam-flag-us", true),
                new LanguageInfo("ru", "Russian", "famfamfam-flag-ru")
            );

            localizationConfiguration.Sources.AddMany(
                GetXmlSource(
                    SavageRulerConsts.Localization.SourceName, 
                    "SavageRuler.Localization.SourceFiles"
                ),
                GetXmlSource(
                    SavageRulerConsts.Localization.GetTypeSourceName(nameof(Power)), 
                    "SavageRuler.Localization.SourceFiles.Type.Power.Power"
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
    }
}
