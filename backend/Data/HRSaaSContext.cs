using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HrSaaS.Models;

public class HRSaaSContext : IdentityDbContext<Users>
{
    public HRSaaSContext(DbContextOptions<HRSaaSContext> options)
        : base(options)
    {
    }

    // public DbSet<TodoItem> TodoItems { get; set; } = null!;
}