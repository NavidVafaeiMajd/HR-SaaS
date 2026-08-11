using System.Globalization;
using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/user-attendance")]
[Authorize]
public class UserAttendanceController : ControllerBase
{
    private readonly HRSaaSDbContext _db;
    private readonly UserManager<Users> _userManager;

    public UserAttendanceController(HRSaaSDbContext db, UserManager<Users> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpGet()]
    public async Task<IActionResult> GetUsersAttendance()
    {
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();

        var users = await _db.Users
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName
            })
            .ToListAsync();

        var attendances = await _db.Attendances
            .ToListAsync();

        var result = users.Select(user =>
        {
            var userAttendances = attendances
                .Where(x => x.UserId == user.Id)
                .ToList();

            return new UserAttendanceSummaryDto
            {
                UserId = user.Id,

                Name = user.FirstName + " " + user.LastName,

                TotalWorkedMinutes = userAttendances
                    .Sum(x => x.WorkedMinutes),

                TotalLateMinutes = userAttendances
                    .Sum(x => x.LateMinutes),

                TotalEarlyLeaveMinutes = userAttendances
                    .Sum(x => x.EarlyLeaveMinutes),

                TotalOvertimeMinutes = userAttendances
                    .Sum(x => x.OvertimeMinutes),

                PresentDays = userAttendances
                    .Count(x => x.Status == AttendanceStatus.Present),

                AbsentDays = userAttendances
                    .Count(x => x.Status == AttendanceStatus.Absent),

                LeaveDays = userAttendances
                    .Count(x => x.Status == AttendanceStatus.Leave)
            };
        }).ToList();

        return Ok(result);
    }

[HttpGet("{userId}")]
public async Task<IActionResult> GetUserAttendanceReport(string userId)
{
    var manager = await _userManager.GetUserAsync(User);

    if (manager is null)
        return Unauthorized();

    var user = await _db.Users
        .Include(x => x.Shift)
        .ThenInclude(x => x.ShiftTimes)
        .FirstOrDefaultAsync(x => x.Id == userId);

    if (user is null)
        return NotFound("User not found.");


    // =====================================================
    // امروز
    // =====================================================

    var today = DateOnly.FromDateTime(DateTime.Now);

    var todayAttendance = await _db.Attendances
        .FirstOrDefaultAsync(x =>
            x.UserId == userId &&
            x.Date == today);


    // =====================================================
    // شیفت امروز
    // =====================================================

    var todayWeekDay = (WeekDay)(((int)DateTime.Now.DayOfWeek + 1) % 7);

    var todayShift = user.Shift?
        .ShiftTimes
        .FirstOrDefault(x => x.DayOfWeek == todayWeekDay);


    // =====================================================
    // مرخصی امروز
    // =====================================================

    var todayLeave = await _db.LeaveRequests
        .AnyAsync(x =>
            x.UserId == userId &&
            x.Status == LeaveStatus.Approved &&
            x.StartDate <= today &&
            x.EndDate >= today);


    // =====================================================
    // وضعیت امروز
    // =====================================================

    AttendanceStatus todayStatus;

    if (todayLeave)
    {
        todayStatus = AttendanceStatus.Leave;
    }
    else if (todayShift is null)
    {
        todayStatus = AttendanceStatus.OutOfShift;
    }
    else if (todayAttendance is not null)
    {
        todayStatus = todayAttendance.Status;
    }
    else
    {
        todayStatus = AttendanceStatus.unknown;
    }


    var todayDto = new TodayAttendanceDto
    {
        Date = today,

        Status = todayStatus,

        ShiftName = user.Shift?.Name,

        ShiftStart = todayShift?.StartTime,

        ShiftEnd = todayShift?.EndTime,

        CheckIn = todayAttendance?.CheckIn,

        CheckOut = todayAttendance?.CheckOut,

        WorkedMinutes = todayAttendance?.WorkedMinutes ?? 0,

        LateMinutes = todayAttendance?.LateMinutes ?? 0,

        EarlyLeaveMinutes =
            todayAttendance?.EarlyLeaveMinutes ?? 0,

        OvertimeMinutes =
            todayAttendance?.OvertimeMinutes ?? 0,

        IsOnLeave = todayLeave
    };


    // =====================================================
    // خلاصه کل حضور و غیاب
    // =====================================================

    var attendances = await _db.Attendances
        .Where(x => x.UserId == userId)
        .ToListAsync();


    var leaveDays = await _db.LeaveRequests
        .Where(x =>
            x.UserId == userId &&
            x.Status == LeaveStatus.Approved)
        .Select(x => new
        {
            x.StartDate,
            x.EndDate
        })
        .ToListAsync();


    var totalLeaveDays = leaveDays.Sum(x =>
        x.EndDate.DayNumber - x.StartDate.DayNumber + 1);


    var summary = new AttendanceSummaryDto
    {
        TotalDays = attendances.Count,

        PresentDays = attendances.Count(x =>
            x.Status == AttendanceStatus.Present),

        AbsentDays = attendances.Count(x =>
            x.Status == AttendanceStatus.Absent),

        LeaveDays = totalLeaveDays,

        TotalWorkedMinutes = attendances.Sum(x =>
            x.WorkedMinutes),

        TotalLateMinutes = attendances.Sum(x =>
            x.LateMinutes),

        TotalEarlyLeaveMinutes = attendances.Sum(x =>
            x.EarlyLeaveMinutes),

        TotalOvertimeMinutes = attendances.Sum(x =>
            x.OvertimeMinutes)
    };


    // =====================================================
    // نتیجه
    // =====================================================

    return Ok(new UserAttendanceReportDto
    {
        Today = todayDto,
        Summary = summary
    });
}
[HttpGet("{userId}/monthly")]
public async Task<IActionResult> GetUserMonthlyAttendance(
    string userId,
    int year,
    int month)
{
    var manager = await _userManager.GetUserAsync(User);

    if (manager is null)
        return Unauthorized();

    if (month < 1 || month > 12)
        return BadRequest("Invalid Persian month.");

    var user = await _db.Users
        .FirstOrDefaultAsync(x => x.Id == userId);

    if (user is null)
        return NotFound("User not found.");



    var persianCalendar = new PersianCalendar();

    DateTime startGregorian =
        persianCalendar.ToDateTime(
            year,
            month,
            1,
            0,
            0,
            0,
            0
        );

    int daysInMonth =
        persianCalendar.GetDaysInMonth(year, month);

    DateTime endGregorian =
        persianCalendar.ToDateTime(
            year,
            month,
            daysInMonth,
            23,
            59,
            59,
            999
        );

    var startDate = DateOnly.FromDateTime(startGregorian);
    var endDate = DateOnly.FromDateTime(endGregorian);


    var attendances = await _db.Attendances
        .Where(x =>
            x.UserId == userId &&
            x.Date >= startDate &&
            x.Date <= endDate)
        .OrderBy(x => x.Date)
        .ToListAsync();



    var summary = new
    {
        totalDays = attendances.Count,

        presentDays = attendances.Count(x =>
            x.Status == AttendanceStatus.Present),

        absentDays = attendances.Count(x =>
            x.Status == AttendanceStatus.Absent),

        leaveDays = attendances.Count(x =>
            x.Status == AttendanceStatus.Leave),

        unknownDays = attendances.Count(x =>
            x.Status == AttendanceStatus.unknown),

        outOfShiftDays = attendances.Count(x =>
            x.Status == AttendanceStatus.OutOfShift),

        totalWorkedMinutes = attendances.Sum(x =>
            x.WorkedMinutes),

        totalLateMinutes = attendances.Sum(x =>
            x.LateMinutes),

        totalEarlyLeaveMinutes = attendances.Sum(x =>
            x.EarlyLeaveMinutes),

        totalOvertimeMinutes = attendances.Sum(x =>
            x.OvertimeMinutes)
    };

    var requests = attendances
        .Select(x => new
        {
            id = x.Id,

            date = x.Date,

            status = x.Status,

            checkIn = x.CheckIn,

            checkOut = x.CheckOut,

            workedMinutes = x.WorkedMinutes,

            lateMinutes = x.LateMinutes,

            earlyLeaveMinutes = x.EarlyLeaveMinutes,

            overtimeMinutes = x.OvertimeMinutes,

            description = x.Description,

            createdAt = x.CreatedAt,

            updatedAt = x.UpdatedAt
        })
        .ToList();


    return Ok(new
    {
        user = new
        {
            id = user.Id,
            name = $"{user.FirstName} {user.LastName}"
        },

        month = new
        {
            year,
            month
        },

        summary,


        requests
    });
}
}
