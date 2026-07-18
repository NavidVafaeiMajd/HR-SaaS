using Microsoft.EntityFrameworkCore;

namespace HrSaaS.Models;

public class HRSaaSContext : DbContext
{
    public HRSaaSContext(DbContextOptions<HRSaaSContext> options)
        : base(options)
    {
    }

    // public DbSet<TodoItem> TodoItems { get; set; } = null!;
}