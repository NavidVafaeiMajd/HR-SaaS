public record LeaveRequestedEvent(
    string UserId,
    Guid LeaveId,
    IEnumerable<Permission> Permission,
    string User_Name,
    IEnumerable<string>? roles,
    string? CreateBy,
    LeaveStatus LeaveStatus
) : IEvent;
