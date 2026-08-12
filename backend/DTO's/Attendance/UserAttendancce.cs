public class UserAttendanceReportDto
{
    public TodayAttendanceDto Today { get; set; } = new();

    public AttendanceSummaryDto Summary { get; set; } = new();
}


public class TodayAttendanceDto
{
    public DateOnly Date { get; set; }

    public AttendanceStatus Status { get; set; }

    public string? ShiftName { get; set; }

    public string? ShiftStart { get; set; }

    public string? ShiftEnd { get; set; }

    public TimeOnly? CheckIn { get; set; }

    public TimeOnly? CheckOut { get; set; }

    public int WorkedMinutes { get; set; }

    public int LateMinutes { get; set; }

    public int EarlyLeaveMinutes { get; set; }

    public int OvertimeMinutes { get; set; }

    public bool IsOnLeave { get; set; }
}


public class AttendanceSummaryDto
{
    public int TotalDays { get; set; }

    public int PresentDays { get; set; }

    public int AbsentDays { get; set; }

    public int LeaveDays { get; set; }

    public int TotalWorkedMinutes { get; set; }

    public int TotalLateMinutes { get; set; }

    public int TotalEarlyLeaveMinutes { get; set; }

    public int TotalOvertimeMinutes { get; set; }
}