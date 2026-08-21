using FluentAssertions;
using HR.IntegrationTests.Infrastructure;
using Microsoft.AspNetCore.Mvc.Testing;

namespace HR.IntegrationTests.Api;

public class NotificationApiTests
    : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public NotificationApiTests(
        CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetNotifications_ShouldReturnSuccess()
    {
        var response = await _client.GetAsync("/api/notifications");

        response.IsSuccessStatusCode.Should().BeTrue();
    }
}