using System.Collections.Generic;
using SavageRuler.Roles.Dto;

namespace SavageRuler.Web.Models.Roles
{
    public class RoleListViewModel
    {
        public IReadOnlyList<RoleListDto> Roles { get; set; }

        public IReadOnlyList<PermissionDto> Permissions { get; set; }
    }
}
