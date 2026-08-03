public class AnnouncementDepartment
{
    public Guid Id { get; set; }

    public Guid AnnouncementId { get; set; }

    public int DepartmentId { get; set; }

    public Departments Department { get; set; } = null!;

    public Announcement Announcement { get; set; } = null!;
}