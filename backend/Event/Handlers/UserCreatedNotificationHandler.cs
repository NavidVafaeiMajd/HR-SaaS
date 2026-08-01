public class LeaveRequestedNotificationHandler
    : IEventHandler<LeaveRequestedEvent>
{
    private readonly INotificationService _notification;
    private readonly IPermissionResolver _permission;

    public LeaveRequestedNotificationHandler(
        INotificationService notification,
        IPermissionResolver permission)
    {
        _notification = notification;
        _permission = permission;
    }

    public async Task Handle(
        LeaveRequestedEvent e)
    {
        var users =
            await _permission.GetUsersAsync(
                Permissions.LeaveEdit);

        await _notification.NotifyUsersAsync(
            users,
            "کاربر جدید",
            $"{e.EmployeeName} کاربر جدید ثبت کرد.",
            $"/leave/{e.LeaveId}");
    }
}