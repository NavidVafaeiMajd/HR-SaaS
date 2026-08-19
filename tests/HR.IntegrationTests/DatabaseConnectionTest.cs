using FluentAssertions;

namespace HR.IntegrationTests;

public class DatabaseConnectionTest
{
    [Fact]
public async Task Database_ShouldBeAvailable()
{
    await using var context = await TestDbContextFactory.CreateAsync();

    var canConnect = await context.Database.CanConnectAsync();

    canConnect.Should().BeTrue();
}
}