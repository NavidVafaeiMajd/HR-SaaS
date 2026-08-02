public class UserRequestedNotificationHandler : IEventHandler<UserRequestedEvent>
{
    private readonly INotificationService _notification;

    public UserRequestedNotificationHandler(INotificationService notification)
    {
        _notification = notification;
    }

    public async Task Handle(UserRequestedEvent e)
    {
        await _notification.NotifyPermissionAsync(
            e.Permission,
            "کاربر جدید",
            $"کاربر {e.UserName} توسط {e.CreateBy} اضافه شد.",
            e.roles,
            $"/users/{e.UserId}"
        );
        await _notification.NotifyAsync(
            e.UserId,
            "اضافه شدید",
            $"شما توسط {e.CreateBy}  اضافه شدید",
            NotificationType.Info,
            $"/users/{e.UserId}"
        );
    }
}
