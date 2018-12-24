using System.Collections.Generic;
using SavageRuler.Roles.Dto;
using SavageRuler.Users.Dto;

namespace SavageRuler.Web.Models.Users
{
    public class UserListViewModel
    {
        public IReadOnlyList<UserDto> Users { get; set; }

        public IReadOnlyList<RoleDto> Roles { get; set; }
    }
}
