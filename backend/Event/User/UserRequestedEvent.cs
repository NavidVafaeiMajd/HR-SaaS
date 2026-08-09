public record UserRequestedEvent(
    IEnumerable<Permission> Permission,
    string UserId,
    string UserName,
    IEnumerable<string>? roles,
    string CreateBy
) : IEvent;
