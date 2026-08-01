using HrSaaS.Models;
using Microsoft.AspNetCore.SignalR;

public class NotificationService : INotificationService
{
    private readonly HRSaaSDbContext _db;
    private readonly IHubContext<NotificationHub> _hub;

    public NotificationService(HRSaaSDbContext db)
    {
        _db = db;
    }
    public async Task NotifyAsync(
        Guid userId,
        string title,
        string message,
        NotificationType type,
        string? url = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            Url = url,
            CreatedAt = DateTime.UtcNow
        };

        _db.Notification.Add(notification);

        await _db.SaveChangesAsync();
    
        // await _hub.Clients
        //     .User(userId.ToString())
        //     .SendAsync("notification", notification);
    }
}