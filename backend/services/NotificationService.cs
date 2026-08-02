using HrSaaS.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

public class NotificationService : INotificationService
{
    private readonly HRSaaSDbContext _db;
    private readonly IHubContext<NotificationHub> _hub;

    public NotificationService(HRSaaSDbContext db)
    {
        _db = db;
    }

    public async Task NotifyAsync(
        string userId,
        string title,
        string message,
        NotificationType type,
        string? url = null
    )
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            Url = url,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Notification.Add(notification);

        await _db.SaveChangesAsync();

        // await _hub.Clients
        //     .User(userId.ToString())
        //     .SendAsync("notification", notification);
    }

    public async Task NotifyUsersAsync(
        IEnumerable<string> userIds,
        string title,
        string message,
        string? url = null,
        NotificationType type = NotificationType.Info
    )
    {
        var notifications = userIds
            .Distinct()
            .Select(userId => new Notification
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = title,
                Message = message,
                Url = url,
                Type = type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
            })
            .ToList();

        if (!notifications.Any())
            return;

        await _db.Notification.AddRangeAsync(notifications);

        await _db.SaveChangesAsync();
    }

    public async Task NotifyPermissionAsync(
        IEnumerable<Permission> permissions,
        string title,
        string message,
        IEnumerable<string>? roles = null,
        string? url = null,
        NotificationType type = NotificationType.Info
    )
    {
        var permissionUserIds = _db
            .RolePermission.Where(rp => permissions.Contains(rp.Permission))
            .Join(_db.UserRoles, rp => rp.RoleId, ur => ur.RoleId, (rp, ur) => ur.UserId);

        var roleUserIds = Enumerable.Empty<string>().AsQueryable();

        if (roles?.Any() == true)
        {
            roleUserIds = _db
                .UserRoles.Join(
                    _db.Roles,
                    ur => ur.RoleId,
                    r => r.Id,
                    (ur, r) => new { ur.UserId, r.Name }
                )
                .Where(x => roles.Contains(x.Name!))
                .Select(x => x.UserId);
        }

        var userIds = await permissionUserIds.Union(roleUserIds).Distinct().ToListAsync();

        await NotifyUsersAsync(userIds, title, message, url, type);
    }
}
