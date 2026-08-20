using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace HR.IntegrationTests;

public class NotificationServiceTest
{
    [Fact]
    public async Task NotifyAsync_ShouldCreateNotification()
    {
        await using var context = await TestDbContextFactory.CreateAsync();

        var service = new NotificationService(context);

        await service.NotifyAsync(
            "user-1",
            "Test title",
            "Test message",
            NotificationType.Info,
            "/test"
        );

        var notification = await context.Notification.FirstOrDefaultAsync();

        notification.Should().NotBeNull();
        notification!.UserId.Should().Be("user-1");
    }
}
