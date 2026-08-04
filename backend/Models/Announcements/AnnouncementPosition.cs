public class AnnouncementPosition
{
    public Guid Id { get; set; }

    public Guid AnnouncementId { get; set; }

    public int PositionId { get; set; }

    public Position Position { get; set; } = null!;

    public Announcement Announcement { get; set; } = null!;
}