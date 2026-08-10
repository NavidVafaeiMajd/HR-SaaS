public class AttendanceListDto
{
    public string UserId { get; set; } = null!;

    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";

    public Guid? AttendanceId { get; set; }

    public AttendanceStatus? Status { get; set; }

    public TimeOnly? CheckIn { get; set; }
    public TimeOnly? CheckOut { get; set; }

    public int? WorkedMinutes { get; set; }
    public int? LateMinutes { get; set; }
    public int? EarlyLeaveMinutes { get; set; }
    public int? OvertimeMinutes { get; set; }

    public string? Description { get; set; }
}