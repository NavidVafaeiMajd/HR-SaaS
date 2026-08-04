public record AnnouncementRequestedEvent(
    string[] UserIds,
    Guid AnnouncementId,
    string CreateBy,
    string? Status
) : IEvent;
