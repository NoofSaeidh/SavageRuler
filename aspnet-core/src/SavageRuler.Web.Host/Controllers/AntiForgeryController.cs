using Microsoft.AspNetCore.Antiforgery;
using SavageRuler.Controllers;

namespace SavageRuler.Web.Host.Controllers
{
    public class AntiForgeryController : SavageRulerControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }
    }
}
