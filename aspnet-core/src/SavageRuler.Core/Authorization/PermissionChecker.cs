using Abp.Authorization;
using SavageRuler.Authorization.Roles;
using SavageRuler.Authorization.Users;

namespace SavageRuler.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
