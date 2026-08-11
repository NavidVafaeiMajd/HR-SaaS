public class UserAttendanceSummaryDto
{
    public string UserId { get; set; } = "";

    public string Name { get; set; } = "";

    public int TotalWorkedMinutes { get; set; }

    public int TotalLateMinutes { get; set; }

    public int TotalEarlyLeaveMinutes { get; set; }

    public int TotalOvertimeMinutes { get; set; }

    public int PresentDays { get; set; }

    public int AbsentDays { get; set; }

    public int LeaveDays { get; set; }
}