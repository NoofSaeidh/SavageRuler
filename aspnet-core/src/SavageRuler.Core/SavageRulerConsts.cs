namespace SavageRuler
{
    public static class SavageRulerConsts
    {
        public const string LocalizationSourceName = Localization.SourceName;

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = false;

        public static class Localization
        {
            public const string SourceName = "SavageRuler";

            // typename doubletime because file in folder with the same name
            public static string GetTypeSourceName(string typeName) => "Type." + typeName + '.' + typeName;
        }
    }
}
