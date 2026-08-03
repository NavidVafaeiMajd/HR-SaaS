public record AnnouncementRequestedEvent(
    string[] UserIds,
    Guid AnnouncementId,
    string CreateBy
) : IEvent;