using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace SavageRuler.Controllers
{
    public abstract class SavageRulerControllerBase: AbpController
    {
        protected SavageRulerControllerBase()
        {
            LocalizationSourceName = SavageRulerConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
