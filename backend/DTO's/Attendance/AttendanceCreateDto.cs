public class AttendanceCreateDto
{
    public string UserId { get; set; } = null!;
    public DateOnly Date { get; set; }

    public AttendanceStatus Status { get; set; }

    public TimeOnly? CheckIn { get; set; }
    public TimeOnly? CheckOut { get; set; }

    public string? Description { get; set; }
}