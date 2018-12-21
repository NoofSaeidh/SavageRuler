using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using SavageRuler.Authorization.Roles;
using SavageRuler.Authorization.Users;
using SavageRuler.MultiTenancy;
using SavageRuler.Rules.Powers;

namespace SavageRuler.EntityFrameworkCore
{
    public class SavageRulerDbContext : AbpZeroDbContext<Tenant, Role, User, SavageRulerDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public SavageRulerDbContext(DbContextOptions<SavageRulerDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Power> Powers { get; set; }
    }
}
