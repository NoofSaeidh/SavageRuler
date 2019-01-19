using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Abp;
using Abp.Extensions;
using Abp.Notifications;
using Abp.Timing;
using SavageRuler.Controllers;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace SavageRuler.Web.Host.Controllers
{
    public class HomeController : SavageRulerControllerBase
    {
        private IHostingEnvironment _environment;

        public HomeController(IHostingEnvironment environment)
        {
            _environment = environment;
        }

        public IActionResult Index()
        {
            return PhysicalFile(
                Path.Combine(_environment.WebRootPath, "index.html"),
                "text/html");
        }
    }
}
