using System.Globalization;
using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly HRSaaSDbContext _context;
    private readonly UserManager<Users> _userManager;

    public DashboardController(
        HRSaaSDbContext context,
        UserManager<Users> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

private static WeekDay ToWeekDay(DayOfWeek dayOfWeek)
{
    return dayOfWeek switch
    {
        DayOfWeek.Saturday => WeekDay.Saturday,
        DayOfWeek.Sunday => WeekDay.Sunday,
        DayOfWeek.Monday => WeekDay.Monday,
        DayOfWeek.Tuesday => WeekDay.Tuesday,
        DayOfWeek.Wednesday => WeekDay.Wednesday,
        DayOfWeek.Thursday => WeekDay.Thursday,
        DayOfWeek.Friday => WeekDay.Friday,
        _ => throw new ArgumentOutOfRangeException(nameof(dayOfWeek))
    };
}

    private static string GetPersianMonthName(int month)
    {
        return month switch
        {
            1 => "فروردین",
            2 => "اردیبهشت",
            3 => "خرداد",
            4 => "تیر",
            5 => "مرداد",
            6 => "شهریور",
            7 => "مهر",
            8 => "آبان",
            9 => "آذر",
            10 => "دی",
            11 => "بهمن",
            12 => "اسفند",
            _ => ""
        };
    }

    // =========================================================
    // Employee Dashboard
    // GET: /api/dashboard/me
    // =========================================================

    [HttpGet("me")]
    public async Task<IActionResult> GetMyDashboard()
    {
        var userId = _userManager.GetUserId(User);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var today = DateOnly.FromDateTime(DateTime.Now);

        var monthStart = new DateOnly(
            today.Year,
            today.Month,
            1
        );

        var user = await _context.Users
            .AsNoTracking()
            .Include(x => x.Department)
            .Include(x => x.Position)
            .Include(x => x.Shift)
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        // =========================================================
        // Today's Leave
        // =========================================================

        var todayLeave = await _context.LeaveRequests
            .AsNoTracking()
            .AnyAsync(x =>
                x.UserId == userId &&
                x.Status == LeaveStatus.Approved &&
                x.StartDate <= today &&
                x.EndDate >= today);

        // =========================================================
        // Today's Shift
        // =========================================================

        var todayDayOfWeek = today.DayOfWeek;

        var shiftTime = user.Shift?.ShiftTimes?
            .FirstOrDefault(x => x.DayOfWeek == ToWeekDay(todayDayOfWeek));

        var hasShiftToday = shiftTime != null &&
                            !string.IsNullOrWhiteSpace(shiftTime.StartTime) &&
                            !string.IsNullOrWhiteSpace(shiftTime.EndTime);

       var currentSalary = await _context.PayrollPayments
            .AsNoTracking()
            .Where(x =>
                x.UserId == userId)
            .Select(x => (decimal?)x.NetSalary)
            .FirstOrDefaultAsync();
        // =========================================================
        // Today's Attendance
        // =========================================================

        var todayAttendance = await _context.Attendances
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.Date == today);

    string todayStatus;

    if (!hasShiftToday)
    {
        todayStatus = "خارج از شیفت";
    }
    else if (todayLeave)
    {
        todayStatus = "مرخصی";
    }
    else if (todayAttendance == null)
    {
        todayStatus = "غایب";
    }
    else
    {
        todayStatus = todayAttendance.Status switch
        {
            AttendanceStatus.Present => "حاضر",
            AttendanceStatus.Absent => "غایب",
            AttendanceStatus.Leave => "مرخصی",
            _ => "نامشخص"
        };
    }
        // =========================================================
        // Remaining Leave Days
        // =========================================================

        var leaveTypes = await _context.LeaveTypes
            .AsNoTracking()
            .ToListAsync();

        var approvedLeaveDays = await _context.LeaveRequests
            .AsNoTracking()
            .Where(x =>
                x.UserId == userId &&
                x.Status == LeaveStatus.Approved &&
                x.StartDate.Year == today.Year)
            .GroupBy(x => x.LeaveTypeId)
            .Select(x => new
            {
                LeaveTypeId = x.Key,
                UsedDays = x.Sum(y => y.TotalDays)
            })
            .ToListAsync();

        var remainingLeaveDays = 0;

        foreach (var leaveType in leaveTypes)
        {
            var usedDays = approvedLeaveDays
                .FirstOrDefault(x => x.LeaveTypeId == leaveType.Id)
                ?.UsedDays ?? 0;

            remainingLeaveDays += Math.Max(
                0,
                (int)(leaveType.AnnualLimit - usedDays)
            );
        }

        // =========================================================
        // Pending Leave Requests
        // =========================================================

        var pendingLeaveRequests = await _context.LeaveRequests
            .AsNoTracking()
            .CountAsync(x =>
                x.UserId == userId &&
                x.Status == LeaveStatus.Pending);

        // =========================================================
        // Monthly Attendance
        // =========================================================

        var monthlyAttendances = await _context.Attendances
            .AsNoTracking()
            .Where(x =>
                x.UserId == userId &&
                x.Date >= monthStart &&
                x.Date <= today)
            .ToListAsync();

        var monthlyLeaves = await _context.LeaveRequests
            .AsNoTracking()
            .Where(x =>
                x.UserId == userId &&
                x.Status == LeaveStatus.Approved &&
                x.StartDate <= today &&
                x.EndDate >= monthStart)
            .ToListAsync();

        // =========================================================
        // Monthly Attendance Statistics
        // =========================================================

        var presentDays = monthlyAttendances.Count(x =>
            x.Status == AttendanceStatus.Present);

        var lateDays = monthlyAttendances.Count(x =>
            x.LateMinutes > 0);

        var totalWorkedMinutes = monthlyAttendances
            .Sum(x => x.WorkedMinutes);

        var totalOvertimeMinutes = monthlyAttendances
            .Sum(x => x.OvertimeMinutes);

        // =========================================================
        // Monthly Leave Days
        // =========================================================

        var leaveDays = 0;

        foreach (var leave in monthlyLeaves)
        {
            var start = leave.StartDate < monthStart
                ? monthStart
                : leave.StartDate;

            var end = leave.EndDate > today
                ? today
                : leave.EndDate;

            if (start <= end)
            {
                leaveDays += end.DayNumber - start.DayNumber + 1;
            }
        }

        // =========================================================
        // Monthly Working Days
        // =========================================================

        var workingDays = 0;

        for (var date = monthStart; date <= today; date = date.AddDays(1))
        {
            var dayOfWeek = date.DayOfWeek;

            var shiftForDay = user.Shift?.ShiftTimes?
                .FirstOrDefault(x => x.DayOfWeek == ToWeekDay(dayOfWeek));

            if (shiftForDay == null)
                continue;

            if (string.IsNullOrWhiteSpace(shiftForDay.StartTime) ||
                string.IsNullOrWhiteSpace(shiftForDay.EndTime))
                continue;

            workingDays++;
        }

        var absentDays = Math.Max(
            0,
            workingDays -
            presentDays -
            leaveDays
        );

        // =========================================================
        // Latest Announcements
        // =========================================================

        var announcements = await _context.Announcement
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .Take(3)
            .Select(x => new AnnouncementDashboardItemDto
            {
                Id = x.Id,
                Title = x.Title,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        // =========================================================
        // Build Response
        // =========================================================

        var result = new EmployeeDashboardDto
        {
            Today = new EmployeeTodayStatusDto
            {
                Status = todayStatus,

                CheckIn = todayAttendance?.CheckIn?.ToString("HH:mm"),

                CheckOut = todayAttendance?.CheckOut?.ToString("HH:mm"),

                RemainingLeaveDays = remainingLeaveDays,

                PendingLeaveRequests = pendingLeaveRequests,
CurrentSalary =currentSalary

            },

            Profile = new EmployeeProfileDashboardDto
            {
                FirstName = user.FirstName,

                LastName = user.LastName,

                Image = user.Image,

                PersonnelCode = user.PersonnelCode,

                DepartmentName = user.Department?.Name,

                PositionName = user.Position?.Name,

                ShiftName = user.Shift?.Name
            },

            MonthlyAttendance = new EmployeeMonthlyAttendanceDto
            {
                PresentDays = presentDays,

                AbsentDays = absentDays,

                LeaveDays = leaveDays,

                LateDays = lateDays,

                TotalWorkedMinutes = totalWorkedMinutes,

                TotalOvertimeMinutes = totalOvertimeMinutes
            },

            Announcements = announcements
        };

        return Ok(result);
    }

[HttpGet("management")]
[Authorize(Roles = "Admin,Manager,HR")]
public async Task<IActionResult> GetManagementDashboard()
{
    var today = DateOnly.FromDateTime(DateTime.Now);

var now = DateTime.Now;

var persianCalendar = new PersianCalendar();

var persianYear = persianCalendar.GetYear(now);
var persianMonth = persianCalendar.GetMonth(now);

var monthStartDateTime = persianCalendar.ToDateTime(
    persianYear,
    persianMonth,
    1,
    0,
    0,
    0,
    0
);

var monthStart = DateOnly.FromDateTime(monthStartDateTime);
    // =========================================================
    // Active Employees
    // =========================================================

    var users = await _context.Users
        .AsNoTracking()
        .Where(x => x.IsActive)
        .Include(x => x.Shift)
        .ThenInclude(x => x.ShiftTimes)
        .ToListAsync();

    var totalEmployees = users.Count;

    // =========================================================
    // Today's Attendance
    // =========================================================

    var todayAttendances = await _context.Attendances
        .AsNoTracking()
        .Where(x => x.Date == today)
        .ToListAsync();

    var todayLeaves = await _context.LeaveRequests
        .AsNoTracking()
        .Where(x =>
            x.Status == LeaveStatus.Approved &&
            x.StartDate <= today &&
            x.EndDate >= today)
        .Select(x => x.UserId)
        .ToHashSetAsync();

    var presentToday = 0;
    var absentToday = 0;
    var leaveToday = 0;
    var outOfShiftToday = 0;

    foreach (var user in users)
    {
        var weekDay = ToWeekDay(today.DayOfWeek);

        var shiftTime = user.Shift?.ShiftTimes?
            .FirstOrDefault(x => x.DayOfWeek == weekDay);

        var hasShift = shiftTime != null &&
                       !string.IsNullOrWhiteSpace(shiftTime.StartTime) &&
                       !string.IsNullOrWhiteSpace(shiftTime.EndTime);

        if (!hasShift)
        {
            outOfShiftToday++;
            continue;
        }

        if (todayLeaves.Contains(user.Id))
        {
            leaveToday++;
            continue;
        }

        var attendance = todayAttendances
            .FirstOrDefault(x => x.UserId == user.Id);

        if (attendance == null)
        {
            absentToday++;
            continue;
        }

        if (attendance.Status == AttendanceStatus.Present)
        {
            presentToday++;
        }
        else if (attendance.Status == AttendanceStatus.Absent)
        {
            absentToday++;
        }
        else if (attendance.Status == AttendanceStatus.Leave)
        {
            leaveToday++;
        }
    }

    // =========================================================
    // Monthly Attendance
    // =========================================================

    var monthlyAttendances = await _context.Attendances
        .AsNoTracking()
        .Where(x =>
            x.Date >= monthStart &&
            x.Date <= today)
        .ToListAsync();

    var monthlyLeaves = await _context.LeaveRequests
        .AsNoTracking()
        .Where(x =>
            x.Status == LeaveStatus.Approved &&
            x.StartDate <= today &&
            x.EndDate >= monthStart)
        .ToListAsync();

    var monthlyPresent = monthlyAttendances.Count(x =>
        x.Status == AttendanceStatus.Present);

    var monthlyAbsent = monthlyAttendances.Count(x =>
        x.Status == AttendanceStatus.Absent);

    var monthlyLeave = monthlyAttendances.Count(x =>
        x.Status == AttendanceStatus.Leave);

    // =========================================================
    // Monthly Attendance Chart
    // =========================================================

    var attendanceChart = new List<MonthlyAttendanceChartItemDto>();

    for (var date = monthStart; date <= today; date = date.AddDays(1))
    {
        var dateAttendances = monthlyAttendances
            .Where(x => x.Date == date)
            .ToList();

        var present = dateAttendances.Count(x =>
            x.Status == AttendanceStatus.Present);

        var absent = dateAttendances.Count(x =>
            x.Status == AttendanceStatus.Absent);

        var leave = monthlyLeaves.Count(x =>
            x.StartDate <= date &&
            x.EndDate >= date);

        attendanceChart.Add(new MonthlyAttendanceChartItemDto
        {
            Date = date.ToString("yyyy-MM-dd"),
            Present = present,
            Absent = absent,
            Leave = leave
        });
    }

    // =========================================================
    // Pending Leave Requests
    // =========================================================

    var pendingLeaves = await _context.LeaveRequests
        .AsNoTracking()
        .Include(x => x.User)
        .Include(x => x.LeaveType)
        .Where(x => x.Status == LeaveStatus.Pending)
        .OrderByDescending(x => x.CreatedAt)
        .Take(4)
        .Select(x => new PendingRequestDashboardItemDto
        {
            Id = x.Id,

            Type = "Leave",

            EmployeeName =
                x.User.FirstName + " " + x.User.LastName,

            CreatedAt = x.CreatedAt
        })
        .ToListAsync();

    var pendingLeaveCount = await _context.LeaveRequests
        .AsNoTracking()
        .CountAsync(x =>
            x.Status == LeaveStatus.Pending);

    // =========================================================
    // Salary Increase Requests
    // =========================================================

    var salaryIncreaseRequests =
        await _context.SalaryIncreaseRequests
            .AsNoTracking()
            .Include(x => x.User)
            .Where(x =>
                x.Status == SalaryIncreaseRequestStatus.Pending)
            .OrderByDescending(x => x.CreatedAt)
            .Take(4)
            .Select(x => new SalaryIncreaseDashboardItemDto
            {
                Id = x.Id,

                EmployeeName =
                    x.User.FirstName + " " + x.User.LastName,

                IncreaseAmount = x.IncreaseAmount,

                Status = x.Status.ToString(),

                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

    var pendingSalaryIncreaseCount =
        await _context.SalaryIncreaseRequests
            .AsNoTracking()
            .CountAsync(x =>
                x.Status == SalaryIncreaseRequestStatus.Pending);

    // =========================================================
    // Latest Requests
    // =========================================================

    var latestRequests = pendingLeaves
        .Concat(
            salaryIncreaseRequests.Select(x =>
                new PendingRequestDashboardItemDto
                {
                    Id = x.Id,

                    Type = "SalaryIncrease",

                    EmployeeName = x.EmployeeName,

                    CreatedAt = x.CreatedAt
                })
        )
        .OrderByDescending(x => x.CreatedAt)
        .Take(4)
        .ToList();

    // =========================================================
    // Announcements
    // =========================================================

    var announcements = await _context.Announcement
        .AsNoTracking()
        .OrderByDescending(x => x.CreatedAt)
        .Take(4)
        .Select(x => new AnnouncementDashboardItemDto
        {
            Id = x.Id,

            Title = x.Title,

            CreatedAt = x.CreatedAt
        })
        .ToListAsync();

    // =========================================================
    // Departments
    // =========================================================

    var departments = await _context.Departments
        .AsNoTracking()
        .Select(x => new DepartmentOverviewDto
        {
            Id = x.Id,

            Name = x.Name,

            EmployeeCount = x.Users
                .Count(u => u.IsActive)
        })
        .OrderByDescending(x => x.EmployeeCount)
        .ToListAsync();

    // =========================================================
    // Payroll
    // =========================================================

    /*
     * Payroll section is calculated from PayrollPayment
     * and PayrollPeriod.
     */

    var currentPersianDate = new PersianCalendar();

    var currentYear =
        currentPersianDate.GetYear(DateTime.Now);

    var currentMonth =
        currentPersianDate.GetMonth(DateTime.Now);

    var salaryEmployees = await _context.EmployeeSalaries
        .AsNoTracking()
        .CountAsync();

    var paidEmployees = 0;
    var unpaidEmployees = salaryEmployees;

    decimal paidAmount = 0;
    decimal unpaidAmount = 0;

        var payments = await _context.PayrollPayments
            .AsNoTracking()
            .ToListAsync();

        paidEmployees = payments.Count(x =>
            x.Status == PayrollPaymentStatus.Paid);

        unpaidEmployees =
            Math.Max(0, salaryEmployees - paidEmployees);

        paidAmount = payments
            .Where(x =>
                x.Status == PayrollPaymentStatus.Paid)
            .Sum(x => x.NetSalary);

        unpaidAmount = payments
            .Where(x =>
                x.Status != PayrollPaymentStatus.Paid)
            .Sum(x => x.NetSalary);

    var totalPayrollAmount =
        paidAmount + unpaidAmount;

    // =========================================================
    // Payroll - Last 6 Persian Months
    // =========================================================

    var payrollChart = new List<PayrollChartItemDto>();

    var currentPersianYear = currentYear;
    var currentPersianMonth = currentMonth;

    for (var i = 5; i >= 0; i--)
    {
        var month = currentPersianMonth - i;
        var year = currentPersianYear;

        while (month <= 0)
        {
            month += 12;
            year--;
        }

        decimal amount = 0;


            amount = await _context.PayrollPayments
                .AsNoTracking()
                .Where(x =>
                    x.Status == PayrollPaymentStatus.Paid)
                .SumAsync(x => (decimal?)x.NetSalary) ?? 0;
        

        payrollChart.Add(new PayrollChartItemDto
        {
            Year = year,

            Month = month,

            MonthName = GetPersianMonthName(month),

            Amount = amount
        });
    }

    // =========================================================
    // Build Response
    // =========================================================

    var result = new ManagementDashboardDto
    {
        Today = new ManagementTodayOverviewDto
        {
            TotalEmployees = totalEmployees,

            Present = presentToday,

            Absent = absentToday,

            OnLeave = leaveToday,

            OutOfShift = outOfShiftToday
        },

        MonthlyAttendance = new ManagementMonthlyAttendanceDto
        {
            Present = monthlyPresent,

            Absent = monthlyAbsent,

            Leave = monthlyLeave,

            Chart = attendanceChart
        },

        Requests = new ManagementRequestsDto
        {
            PendingLeaveRequests = pendingLeaveCount,

            PendingSalaryIncreaseRequests =
                pendingSalaryIncreaseCount,

            TotalPendingRequests =
                pendingLeaveCount +
                pendingSalaryIncreaseCount,

            Latest = latestRequests
        },

        Payroll = new ManagementPayrollDto
        {
            SalaryEmployees = salaryEmployees,

            PaidEmployees = paidEmployees,

            UnpaidEmployees = unpaidEmployees,

            PaidAmount = paidAmount,

            UnpaidAmount = unpaidAmount,

            TotalAmount = totalPayrollAmount
        },

        Announcements = announcements,

        SalaryIncreaseRequests =
            salaryIncreaseRequests,

        Departments = departments,

        PayrollChart = payrollChart
    };

    return Ok(result);
}
}