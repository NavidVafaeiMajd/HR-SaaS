public class ManagementDashboardDto
{
    public ManagementTodayOverviewDto Today { get; set; } = new();

    public ManagementMonthlyAttendanceDto MonthlyAttendance { get; set; } = new();

    public ManagementRequestsDto Requests { get; set; } = new();

    public ManagementPayrollDto Payroll { get; set; } = new();

    public List<AnnouncementDashboardItemDto> Announcements { get; set; } = [];

    public List<SalaryIncreaseDashboardItemDto> SalaryIncreaseRequests { get; set; } = [];

    public List<DepartmentOverviewDto> Departments { get; set; } = [];

    public List<PayrollChartItemDto> PayrollChart { get; set; } = [];
}

public class SalaryIncreaseDashboardItemDto
{
    public Guid Id { get; set; }

    public string EmployeeName { get; set; } = "";

    public decimal IncreaseAmount { get; set; }

    public string Status { get; set; } = "";

    public DateTime CreatedAt { get; set; }
}

public class DepartmentOverviewDto
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public int EmployeeCount { get; set; }
}
public class ManagementTodayOverviewDto
{
    public int TotalEmployees { get; set; }

    public int Present { get; set; }

    public int Absent { get; set; }

    public int OnLeave { get; set; }

    public int OutOfShift { get; set; }
}
public class ManagementMonthlyAttendanceDto
{
    public int Present { get; set; }

    public int Absent { get; set; }

    public int Leave { get; set; }

    public List<MonthlyAttendanceChartItemDto> Chart { get; set; } = [];
}

public class MonthlyAttendanceChartItemDto
{
    public string Date { get; set; } = "";

    public int Present { get; set; }

    public int Absent { get; set; }

    public int Leave { get; set; }
}
public class ManagementRequestsDto
{
    public int PendingLeaveRequests { get; set; }

    public int PendingSalaryIncreaseRequests { get; set; }

    public int TotalPendingRequests { get; set; }

    public List<PendingRequestDashboardItemDto> Latest { get; set; } = [];
}

public class PendingRequestDashboardItemDto
{
    public Guid Id { get; set; }

    public string Type { get; set; } = "";

    public string EmployeeName { get; set; } = "";

    public DateTime CreatedAt { get; set; }
}
public class ManagementPayrollDto
{
    public int SalaryEmployees { get; set; }

    public int PaidEmployees { get; set; }

    public int UnpaidEmployees { get; set; }

    public decimal PaidAmount { get; set; }

    public decimal UnpaidAmount { get; set; }

    public decimal TotalAmount { get; set; }
}

public class PayrollChartItemDto
{
    public int Year { get; set; }

    public int Month { get; set; }

    public string MonthName { get; set; } = "";

    public decimal Amount { get; set; }
}