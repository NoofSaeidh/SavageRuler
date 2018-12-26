using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SavageRuler.Controllers;

namespace SavageRuler.Web.Client.Controllers
{
    public class HomeController : SavageRulerControllerBase
    {

        //public IActionResult Index()
        //{
        //    return Redirect("/swagger");
        //}

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
