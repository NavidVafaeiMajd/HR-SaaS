using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HrSaaS.Infrastructure.Bootstrap;

public static class ApplicationBootstrapper
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<HRSaaSDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<Users>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();

        // Apply Migrations
        await db.Database.MigrateAsync();

        // Seed Roles
        string[] roles = { "Admin" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(
                    new Role { Name = role, NormalizedName = role.ToUpper() }
                );
            }
        }

        // Check if admin exists
        var admin = await userManager.GetUsersInRoleAsync("Admin");

        if (admin.Count == 0)
        {
            var user = new Users
            {
                UserName = "admin",
                Email = "admin@company.local",
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(user, "Admin@123456");

            if (!result.Succeeded)
            {
                throw new Exception(
                    string.Join(Environment.NewLine, result.Errors.Select(e => e.Description))
                );
            }

            await userManager.AddToRoleAsync(user, "Admin");
        }
    }
}
