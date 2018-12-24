using System.Collections.Generic;
using SavageRuler.Roles.Dto;

namespace SavageRuler.Web.Models.Common
{
    public interface IPermissionsEditViewModel
    {
        List<FlatPermissionDto> Permissions { get; set; }
    }
}