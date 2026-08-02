public interface INotificationService
{
    Task NotifyAsync(
        string userId,
        string title,
        string message,
        NotificationType type,
        string? url = null
    );

    Task NotifyUsersAsync(
        IEnumerable<string> userIds,
        string title,
        string message,
        string? url = null,
        NotificationType type = NotificationType.Info
    );
    Task NotifyPermissionAsync(
        IEnumerable<Permission> permissions,
        string title,
        string message,
                IEnumerable<string>? roles = null,
        string? url = null,
        NotificationType type = NotificationType.Info
    );
}
