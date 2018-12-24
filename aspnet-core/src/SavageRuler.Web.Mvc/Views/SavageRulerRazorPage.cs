using Microsoft.AspNetCore.Mvc.Razor.Internal;
using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;

namespace SavageRuler.Web.Views
{
    public abstract class SavageRulerRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected SavageRulerRazorPage()
        {
            LocalizationSourceName = SavageRulerConsts.LocalizationSourceName;
        }
    }
}
