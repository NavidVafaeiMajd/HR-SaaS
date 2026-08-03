public class AnnouncementCreatedNotificationHandler : IEventHandler<AnnouncementRequestedEvent>
{
    private readonly INotificationService _notification;

    public AnnouncementCreatedNotificationHandler(INotificationService notification)
    {
        _notification = notification;
    }

    public async Task Handle(AnnouncementRequestedEvent e)
    {

        await _notification.NotifyUsersAsync(
            e.UserIds,
            "ابلاغیه جدید",
            $"یک ابلاغیه جدید توسط {e.CreateBy} منتشر شد.",
                        $"/news-list/{e.AnnouncementId}",

            NotificationType.Info
        );
    }
}
