namespace HrSaaS.Infrastructure.Bootstrap;

public static class BootstrapExtensions
{
    public static async Task BootstrapAsync(this WebApplication app)
    {
        await ApplicationBootstrapper.InitializeAsync(app.Services);
    }
}