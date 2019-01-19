using Microsoft.AspNetCore.Mvc;
using SavageRuler.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Web.Host.Controllers
{
    public class ApiController : SavageRulerControllerBase
    {
        public IActionResult Index()
        {
            return Redirect("/api/docs");
        }
    }
}
