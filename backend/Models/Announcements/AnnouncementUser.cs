public class AnnouncementUser
{
    public Guid Id { get; set; }

    public Guid AnnouncementId { get; set; }

    public string UserId { get; set; } = null!;

    public Users User { get; set; } = null!;

    public Announcement Announcement { get; set; } = null!;
}