using Abp.Auditing;
using Abp.Extensions;
using Abp.Localization;
using Abp.Localization.Sources;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Localization
{
    [DisableAuditing]
    public class LocalizationAppService : SavageRulerAppServiceBase
    {
        private readonly ILocalizationManager _localizationManager;
        private readonly ILanguageManager _languageManager;

        public LocalizationAppService(
            ILocalizationManager localizationManager,
            ILanguageManager languageManager)
        {
            _localizationManager = localizationManager;
            _languageManager = languageManager;
        }

        public IReadOnlyList<LanguageInfo> GetAllLanguages()
        {
            return _languageManager.GetLanguages();
        }

        public LanguageInfo GetCurrentLanguage()
        {
            return _languageManager.CurrentLanguage;
        }

        public IReadOnlyList<SourceInfo> GetAllSources()
        {
            var sources = _localizationManager.GetAllSources();
            return sources.Select(s => new SourceInfo(s.Name, s.GetType().Name)).ToList();
        }

        public IReadOnlyDictionary<string, string> GetLocalizedStrings(string sourceName)
        {
            return GetAllStrings(sourceName)
                .ToDictionary(s => s.Name, s => s.Value);
        }

        public IReadOnlyDictionary<string, string> GetLocalizedProperties(string typeName, bool camelCaseNames = true)
        {
            var result = GetAllStrings(SavageRulerConsts.Localization.GetTypeSourceName(typeName));
            if (camelCaseNames)
                return result.ToDictionary(s => s.Name.ToCamelCase(), s => s.Value);
            return result.ToDictionary(s => s.Name, s => s.Value);
        }

        // culture obtained by aspnetcore mechanism
        private IReadOnlyList<LocalizedString> GetAllStrings(string sourceName)
        {
            // todo: helper for exceptions
            if (sourceName == null)
                throw new UserFriendlyException("Argument must be specified", new ArgumentNullException(nameof(sourceName)));

            return _localizationManager
                .GetSource(sourceName)
                .GetAllStrings();
        }
    }

    // todo: in separate file
    public class SourceInfo
    {
        public SourceInfo(string name, string type)
        {
            Name = name;
            Type = type;
        }

        public string Name { get; }
        public string Type { get; }
    }
}
