using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HrSaaS.Models;

public class HRSaaSDbContext : IdentityDbContext<Users, Role, string>
{
    public HRSaaSDbContext(DbContextOptions<HRSaaSDbContext> options)
        : base(options) { }

    public DbSet<RolePermission> RolePermission { get; set; } = null!;
    public DbSet<Departments> Departments { get; set; } = null!;
    public DbSet<Position> Positions { get; set; } = null!;
    public DbSet<SocialMedia> SocialMedia { get; set; } = null!;
    public DbSet<EmergencyCall> EmergencyCall { get; set; } = null!;
    public DbSet<Biography> Biography { get; set; } = null!;
    public DbSet<Shift> Shifts { get; set; } = null!;
    public DbSet<ShiftTime> ShiftsTime { get; set; } = null!;
    public DbSet<Notification> Notification { get; set; } = null!;
    public DbSet<Announcement> Announcement { get; set; } = null!;
    public DbSet<AnnouncementDepartment> AnnouncementDepartments { get; set; } = null!;
    public DbSet<AnnouncementPosition> AnnouncementPositions { get; set; } = null!;
    public DbSet<AnnouncementUser> AnnouncementUsers { get; set; } = null!;
    public DbSet<LeaveType> LeaveTypes { get; set; } = null!;
    public DbSet<LeaveRequest> LeaveRequests { get; set; } = null!;
    public DbSet<Attendance> Attendances { get; set; } = null!;
    public DbSet<EmployeeSalary> EmployeeSalaries { get; set; } = null!;
    public DbSet<EmployeeSalaryHistory> EmployeeSalaryHistories { get; set; } = null!;
    public DbSet<SalaryIncreaseRequest> SalaryIncreaseRequests { get; set; } = null!;
    public DbSet<PayrollPayment> PayrollPayments { get; set; } = null!;
    public DbSet<Company> Company { get; set; } = null!;





    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<IAuditable>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RolePermission>().HasKey(x => new { x.RoleId, x.Permission });

        modelBuilder
            .Entity<Position>()
            .HasOne(p => p.Department)
            .WithMany(d => d.Positions)
            .HasForeignKey(p => p.DepartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Users>()
            .HasOne(u => u.EmergencyCall)
            .WithOne(b => b.User)
            .HasForeignKey<EmergencyCall>(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Users>()
        .HasOne(u => u.SocialMedia)
        .WithOne(b => b.User)
        .HasForeignKey<SocialMedia>(b => b.UserId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Users>()
.HasOne(u => u.Biography)
.WithOne(b => b.User)
.HasForeignKey<Biography>(b => b.UserId)
.OnDelete(DeleteBehavior.Cascade);
        
            modelBuilder.Entity<PayrollPayment>()
        .HasIndex(x => new
        {
            x.UserId,
            x.Year,
            x.Month
        })
        .IsUnique();
    
    }
}
