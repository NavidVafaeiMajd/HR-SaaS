public class EmployeeDashboardDto
{
    public EmployeeTodayStatusDto Today { get; set; } = new();

    public EmployeeProfileDashboardDto Profile { get; set; } = new();

    public EmployeeMonthlyAttendanceDto MonthlyAttendance { get; set; } = new();

    public List<AnnouncementDashboardItemDto> Announcements { get; set; } = [];
}

public class EmployeeTodayStatusDto
{
    public string Status { get; set; } = "";

    public string? CheckIn { get; set; }

    public string? CheckOut { get; set; }

    public decimal? CurrentSalary { get; set; }

    public int RemainingLeaveDays { get; set; }

    public int PendingLeaveRequests { get; set; }

}
public class EmployeeProfileDashboardDto
{
    public string FirstName { get; set; } = "";

    public string LastName { get; set; } = "";

    public string? Image { get; set; }

    public int? PersonnelCode { get; set; }

    public string? DepartmentName { get; set; }

    public string? PositionName { get; set; }

    public string? ShiftName { get; set; }
}

public class EmployeeMonthlyAttendanceDto
{
    public int PresentDays { get; set; }

    public int AbsentDays { get; set; }

    public int LeaveDays { get; set; }

    public int LateDays { get; set; }

    public int TotalWorkedMinutes { get; set; }

    public int TotalOvertimeMinutes { get; set; }

    public double TotalWorkedHours =>
        Math.Round(TotalWorkedMinutes / 60.0, 2);

    public double TotalOvertimeHours =>
        Math.Round(TotalOvertimeMinutes / 60.0, 2);
}

public class AnnouncementDashboardItemDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = "";

    public DateTime CreatedAt { get; set; }
}