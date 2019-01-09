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

            public static string GetTypeSourceName(string typeName) => SourceName +  ".Type." + typeName;
        }
    }
}
