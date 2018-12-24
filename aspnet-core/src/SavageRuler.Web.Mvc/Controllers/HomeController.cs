using Microsoft.AspNetCore.Mvc;
using Abp.AspNetCore.Mvc.Authorization;
using SavageRuler.Controllers;

namespace SavageRuler.Web.Controllers
{
    [AbpMvcAuthorize]
    public class HomeController : SavageRulerControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
	}
}
