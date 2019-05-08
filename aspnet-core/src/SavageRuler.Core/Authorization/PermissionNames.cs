using System;

namespace SavageRuler.Authorization
{
    public static class PermissionNames
    {
        [Obsolete]
        public const string Pages_Tenants = "Pages.Tenants";

        [Obsolete]
        public const string Pages_Users = "Pages.Users";

        [Obsolete]
        public const string Pages_Roles = "Pages.Roles";

        public const string Admin = "Admin";
        public const string User = "User";
        public const string Manager = "Manager";
        public const string Manager_Rules = "Manager.Rules";
    }
}
