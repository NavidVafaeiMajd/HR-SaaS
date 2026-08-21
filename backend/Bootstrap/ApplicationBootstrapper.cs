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

        // Apply pending migrations
        await db.Database.MigrateAsync();

        // Seed Roles
        var roles = new[]
        {
            new Role
            {
                Name = "Admin",
                NormalizedName = "ADMIN",
                Description = "System administrator with full access to the HR SaaS system.",
                CreatedAt = DateTime.UtcNow
            }
        };

        foreach (var role in roles)
        {
            if (await roleManager.RoleExistsAsync(role.Name!))
                continue;

            var result = await roleManager.CreateAsync(role);

            if (!result.Succeeded)
            {
                throw new Exception(
                    $"Failed to create role '{role.Name}':{Environment.NewLine}" +
                    string.Join(
                        Environment.NewLine,
                        result.Errors.Select(e => e.Description)
                    )
                );
            }
        }

        // Check if Admin user already exists
        var admins = await userManager.GetUsersInRoleAsync("Admin");

        if (admins.Count == 0)
        {
            var user = new Users
            {
                UserName = "admin",
                NormalizedUserName = "ADMIN",

                Email = "admin@company.local",
                NormalizedEmail = "ADMIN@COMPANY.LOCAL",

                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(
                user,
                "Admin@123456"
            );

            if (!result.Succeeded)
            {
                throw new Exception(
                    $"Failed to create admin user:{Environment.NewLine}" +
                    string.Join(
                        Environment.NewLine,
                        result.Errors.Select(e => e.Description)
                    )
                );
            }

            var roleResult = await userManager.AddToRoleAsync(
                user,
                "Admin"
            );

            if (!roleResult.Succeeded)
            {
                throw new Exception(
                    $"Failed to assign Admin role to user '{user.UserName}':{Environment.NewLine}" +
                    string.Join(
                        Environment.NewLine,
                        roleResult.Errors.Select(e => e.Description)
                    )
                );
            }
        }
    }
}