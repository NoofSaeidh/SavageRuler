using Abp;
using Abp.IO.Extensions;
using Abp.Localization.Dictionaries.Xml;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Localization
{
    // copy paste from XmlEmbeddedFileLocalizationTypeDictionaryProvider
    // but with different paths to resources
    public class XmlEmbeddedFileLocalizationTypeDictionaryProvider : LocalizationDictionaryProviderBase
    {
        private readonly Assembly _assembly;
        private readonly string _rootNamespace;

        // stored in the following way:
        // SourceFiles/Type/{TypeName}/{TypeName}.xml
        // SourceFiles/Type/{TypeName}/{TypeName}-ru.xml
        // part 'SourceFiles/Type/' is configurable
        public XmlEmbeddedFileLocalizationTypeDictionaryProvider(Assembly assembly, string rootNamespace)
        {
            _assembly = assembly;
            _rootNamespace = rootNamespace;
        }

        public override void Initialize(string sourceName)
        {
            var allCultureInfos = CultureInfo.GetCultures(CultureTypes.AllCultures);
            var typeName = sourceName.Split('.').Last();
            var resourceNames = _assembly.GetManifestResourceNames().Where(resouceName =>
                allCultureInfos.Any(culture => resouceName.EndsWith($"{typeName}.{typeName}.xml", true, null) ||
                                               resouceName.EndsWith($"{typeName}.{typeName}-{culture.Name}.xml", true,
                                                   null))).ToList();
            foreach (var resourceName in resourceNames)
            {
                if (resourceName.StartsWith(_rootNamespace))
                {
                    using (var stream = _assembly.GetManifestResourceStream(resourceName))
                    {
                        var xmlString = Utf8Helper.ReadStringFromStream(stream);

                        var dictionary = CreateXmlLocalizationDictionary(xmlString);
                        if (Dictionaries.ContainsKey(dictionary.CultureInfo.Name))
                        {
                            throw new AbpInitializationException(sourceName + " source contains more than one dictionary for the culture: " + dictionary.CultureInfo.Name);
                        }

                        Dictionaries[dictionary.CultureInfo.Name] = dictionary;

                        if (resourceName.EndsWith(typeName + ".xml"))
                        {
                            if (DefaultDictionary != null)
                            {
                                throw new AbpInitializationException("Only one default localization dictionary can be for source: " + sourceName);
                            }

                            DefaultDictionary = dictionary;
                        }
                    }
                }
            }
        }

        protected virtual XmlLocalizationDictionary CreateXmlLocalizationDictionary(string xmlString)
        {
            return XmlLocalizationDictionary.BuildFomXmlString(xmlString);
        }


        // copied from Abp
        // perhaps should expose
        private static class Utf8Helper
        {
            public static string ReadStringFromStream(Stream stream)
            {
                var bytes = stream.GetAllBytes();
                var skipCount = HasBom(bytes) ? 3 : 0;
                return Encoding.UTF8.GetString(bytes, skipCount, bytes.Length - skipCount);
            }

            private static bool HasBom(byte[] bytes)
            {
                if (bytes.Length < 3)
                {
                    return false;
                }

                if (!(bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF))
                {
                    return false;
                }

                return true;
            }
        }
    }
}
