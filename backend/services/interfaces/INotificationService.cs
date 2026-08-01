public interface INotificationService
{
    Task NotifyAsync(
        Guid userId,
        string title,
        string message,
        NotificationType type,
        string? url = null);
}