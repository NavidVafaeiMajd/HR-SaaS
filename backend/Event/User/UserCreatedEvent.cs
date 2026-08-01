public record LeaveRequestedEvent(
    Guid UserId,
    Guid EmployeeId,
    string EmployeeName
) : IEvent;