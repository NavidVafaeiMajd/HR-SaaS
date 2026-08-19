using HrSaaS.Models;
using Microsoft.EntityFrameworkCore;

namespace HR.IntegrationTests;

public static class TestDbContextFactory
{
    private static readonly string ConnectionString =
        Environment.GetEnvironmentVariable("HR_TEST_CONNECTION")
        ?? throw new InvalidOperationException(
            "HR_TEST_CONNECTION environment variable is not configured."
        );

    public static async Task<HRSaaSDbContext> CreateAsync()
    {
        var options = new DbContextOptionsBuilder<HRSaaSDbContext>()
            .UseSqlServer(ConnectionString)
            .Options;

        var context = new HRSaaSDbContext(options);

        await context.Database.MigrateAsync();

        return context;
    }

    public static async Task ResetDatabaseAsync()
    {
        var options = new DbContextOptionsBuilder<HRSaaSDbContext>()
            .UseSqlServer(ConnectionString)
            .Options;

        await using var context = new HRSaaSDbContext(options);

        await context.Database.EnsureDeletedAsync();
        await context.Database.MigrateAsync();
    }
    
}