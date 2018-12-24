using Abp.AspNetCore.Mvc.ViewComponents;

namespace SavageRuler.Web.Views
{
    public abstract class SavageRulerViewComponent : AbpViewComponent
    {
        protected SavageRulerViewComponent()
        {
            LocalizationSourceName = SavageRulerConsts.LocalizationSourceName;
        }
    }
}
