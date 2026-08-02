public class Announcement
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;
    public ICollection<AnnouncementDepartment> Departments { get; set; } =
        new List<AnnouncementDepartment>();

    public ICollection<AnnouncementPosition> Positions { get; set; } =
        new List<AnnouncementPosition>();

    public ICollection<AnnouncementUser> Users { get; set; } = new List<AnnouncementUser>();

    public DateTime CreatedAt { get; set; }

    public Guid CreatedBy { get; set; }
}
