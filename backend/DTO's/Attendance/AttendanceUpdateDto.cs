public class AttendanceUpdateDto
{
    public AttendanceStatus Status { get; set; }

    public TimeOnly? CheckIn { get; set; }
    public TimeOnly? CheckOut { get; set; }

    public string? Description { get; set; }
}