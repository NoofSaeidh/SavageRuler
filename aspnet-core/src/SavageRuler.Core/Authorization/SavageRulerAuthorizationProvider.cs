using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace SavageRuler.Authorization
{
    public class SavageRulerAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
            context.CreatePermission(PermissionNames.Admin, L("Admin"));
            context.CreatePermission(PermissionNames.Manager, L("Manager"));
            context.CreatePermission(PermissionNames.Manager_Rules, L("Rules"));
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, SavageRulerConsts.LocalizationSourceName);
        }
    }
}
