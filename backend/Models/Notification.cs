public class Notification
{
    public Guid Id { get; set; }

    public string UserId { get; set; }

    public string Title { get; set; } = "";

    public string Message { get; set; } = "";

    public NotificationType Type { get; set; }

    public string? Url { get; set; }

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ReadAt { get; set; }
}
public enum NotificationType
{
    Info,
    Success,
    Warning,
    Error
}