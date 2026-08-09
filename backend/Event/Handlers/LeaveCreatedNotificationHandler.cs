public class LeaveCreatedNotificationHandler : IEventHandler<LeaveRequestedEvent>
{
    private readonly INotificationService _notification;

    public LeaveCreatedNotificationHandler(INotificationService notification)
    {
        _notification = notification;
    }

    public async Task Handle(LeaveRequestedEvent e)
    {
        switch (e.LeaveStatus)
        {
            case LeaveStatus.Pending:
                await _notification.NotifyAsync(
                    e.UserId,
                    "درخواست مرخصی جدید ",
                    "درخواست مرخصی شما ثبت شد",
                    NotificationType.Info,
                    $"/user-leave"
                );
                await _notification.NotifyPermissionAsync(
                    e.Permission,
                    "درخواست مرخصی جدید ",
                    $"درخواست مرخصی برای {e.User_Name} ثبت شده است. لطفا بررسی نمایید.",
                    e.roles,
                    $"/leave-list"
                );
                break;
            case LeaveStatus.Approved:
                await _notification.NotifyAsync(
                    e.UserId,
                    "درخواست مرخصی شما تایید شد ",
                    $"درخواست مرخصی شما توسط {e.CreateBy} تایید شد.",
                    NotificationType.Info,
                    $"/user-leave"
                );
                break;
            case LeaveStatus.Canceled:
                await _notification.NotifyPermissionAsync(
                    e.Permission,
                    $"درخواست مرخصی {e.User_Name}  لغو شد ",
                    $"درخواست مرخصی برای {e.User_Name} توسط خود کاربر لغو شده است.",
                    e.roles,
                    $"/leave-list"
                );
                break;
            case LeaveStatus.Rejected:
                await _notification.NotifyAsync(
                    e.UserId,
                    "درخواست مرخصی شما تایید نشد ",
                    $"درخواست مرخصی شما توسط {e.CreateBy} !مورد تایید قرار نگرفت شد.",
                    NotificationType.Info,
                    $"/user-leave"
                );
                break;
            default:
                break;
        }
    }
}
