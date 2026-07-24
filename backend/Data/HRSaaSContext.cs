using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HrSaaS.Models;

public class HRSaaSDbContext : IdentityDbContext<Users,Role,string>
{
    public HRSaaSDbContext(DbContextOptions<HRSaaSDbContext> options)
        : base(options) { }

    public DbSet<RolePermission> RolePermission { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
            base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RolePermission>().HasKey(x => new { x.RoleId,x.Permission  });
    }
}
