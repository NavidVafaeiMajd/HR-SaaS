using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/attendance")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly HRSaaSDbContext _db;
    private readonly UserManager<Users> _userManager;

    public AttendanceController(
        HRSaaSDbContext db,
        UserManager<Users> userManager)
    {
        _db = db;
        _userManager = userManager;
    }


    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();

        var date = DateOnly.FromDateTime(DateTime.Now);

        var weekDay = (WeekDay)(((int)date.DayOfWeek + 1) % 7);

        var employees = await _db.Users
            .Include(x => x.Shift)
            .ThenInclude(x => x.ShiftTimes)
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName,
                Shift = x.Shift
            })
            .ToListAsync();

        var userIds = employees
            .Select(x => x.Id)
            .ToList();

        var attendances = await _db.Attendances
            .Where(x =>
                x.Date == date &&
                userIds.Contains(x.UserId))
            .ToListAsync();

        var leaves = await _db.LeaveRequests
            .Where(x =>
                userIds.Contains(x.UserId) &&
                x.StartDate <= date &&
                x.EndDate >= date &&
                x.Status == LeaveStatus.Approved)
            .ToListAsync();

        var result = employees.Select(employee =>
        {
            var attendance = attendances
                .FirstOrDefault(x => x.UserId == employee.Id);

            var leave = leaves
                .FirstOrDefault(x => x.UserId == employee.Id);

            var todayShiftTime = employee.Shift?.ShiftTimes
                .FirstOrDefault(x => x.DayOfWeek == weekDay);

            var isOutOfShift =
                todayShiftTime is null ||
                todayShiftTime.StartTime is null ||
                todayShiftTime.EndTime is null;

            AttendanceStatus? status;

            if (isOutOfShift)
            {
                status = AttendanceStatus.OutOfShift;
            }
            else if (leave is not null)
            {
                status = AttendanceStatus.Leave;
            }
            else
            {
                status = attendance?.Status;
            }

            return new AttendanceListDto
            {
                UserId = employee.Id,

                FirstName = employee.FirstName,
                LastName = employee.LastName,

                AttendanceId = attendance?.Id,

                Status = status,

                CheckIn = attendance?.CheckIn,
                CheckOut = attendance?.CheckOut,

                WorkedMinutes = attendance?.WorkedMinutes,
                LateMinutes = attendance?.LateMinutes,
                EarlyLeaveMinutes = attendance?.EarlyLeaveMinutes,
                OvertimeMinutes = attendance?.OvertimeMinutes,

                Description = attendance?.Description
            };
        }).ToList();

        return Ok(result);
    }

[HttpPatch("{UserId}/present")]
public async Task<IActionResult> SetPresent(string UserId,
    AttendancePresentDto dto)
{
    var manager = await _userManager.GetUserAsync(User);

    if (manager is null)
        return Unauthorized();

    var date = DateOnly.FromDateTime(DateTime.Now);

    // بررسی اینکه کارمند وجود دارد
    var employee = await _db.Users
        .FirstOrDefaultAsync(x => x.Id == UserId);

    if (employee is null)
        return NotFound("Employee not found.");

    // // اگر سیستم ManagerId دارد
    // if (employee.ManagerId != manager.Id)
    //     return Forbid();

    // پیدا کردن Attendance امروز
    var attendance = await _db.Attendances
        .FirstOrDefaultAsync(x =>
            x.UserId == UserId &&
            x.Date == date);

    if (attendance is null)
    {
        // رکورد وجود ندارد → ایجاد کن
        attendance = new Attendance
        {
            UserId = UserId,
            Date = date,

            Status = AttendanceStatus.Present,

            CheckIn = dto.CheckIn,
            CheckOut = dto.CheckOut,

            CreatedAt = DateTime.UtcNow
        };

        _db.Attendances.Add(attendance);
    }
    else
    {
        // رکورد وجود دارد → آپدیت کن
        attendance.Status = AttendanceStatus.Present;

        attendance.CheckIn = dto.CheckIn;
        attendance.CheckOut = dto.CheckOut;

        attendance.UpdatedAt = DateTime.UtcNow;
    }

    await _db.SaveChangesAsync();

    return Ok(new
    {
        message = "Attendance marked as present.",
        attendanceId = attendance.Id,
        userId = attendance.UserId,
        date = attendance.Date,
        status = attendance.Status,
        checkIn = attendance.CheckIn,
        checkOut = attendance.CheckOut
    });
}

[HttpPatch("{UserId}/absent")]
public async Task<IActionResult> SetAbsent(
    string UserId,
    AttendanceAbsentDto dto)
{
    var manager = await _userManager.GetUserAsync(User);

    if (manager is null)
        return Unauthorized();

    var date = DateOnly.FromDateTime(DateTime.Now);

    // بررسی وجود کارمند
    var employee = await _db.Users
        .FirstOrDefaultAsync(x => x.Id == UserId);

    if (employee is null)
        return NotFound("Employee not found.");

    // اگر سیستم ManagerId دارد
    // if (employee.ManagerId != manager.Id)
    //     return Forbid();

    // پیدا کردن Attendance امروز
    var attendance = await _db.Attendances
        .FirstOrDefaultAsync(x =>
            x.UserId == UserId &&
            x.Date == date);

    if (attendance is null)
    {
        // رکورد وجود ندارد → ایجاد کن
        attendance = new Attendance
        {
            UserId = UserId,
            Date = date,

            Status = AttendanceStatus.Absent,

            CheckIn = null,
            CheckOut = null,

            Description = dto.Description,

            CreatedAt = DateTime.UtcNow
        };

        _db.Attendances.Add(attendance);
    }
    else
    {
        // رکورد وجود دارد → آپدیت کن
        attendance.Status = AttendanceStatus.Absent;

        attendance.CheckIn = null;
        attendance.CheckOut = null;

        attendance.WorkedMinutes = 0;
        attendance.LateMinutes = 0;
        attendance.EarlyLeaveMinutes = 0;
        attendance.OvertimeMinutes = 0;

        attendance.Description = dto.Description;

        attendance.UpdatedAt = DateTime.UtcNow;
    }

    await _db.SaveChangesAsync();

    return Ok(new
    {
        message = "Attendance marked as absent.",
        attendanceId = attendance.Id,
        userId = attendance.UserId,
        date = attendance.Date,
        status = attendance.Status,
        checkIn = attendance.CheckIn,
        checkOut = attendance.CheckOut
    });
}

    // PUT: api/attendance/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        Guid id,
        AttendanceUpdateDto dto)
    {
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();


        var attendance = await _db.Attendances
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (attendance is null)
            return NotFound();


        // // بررسی دسترسی مدیر
        // if (attendance.User.ManagerId != manager.Id)
        //     return Forbid();


        attendance.Status = dto.Status;

        attendance.CheckIn = dto.CheckIn;
        attendance.CheckOut = dto.CheckOut;

        attendance.Description = dto.Description;

        attendance.UpdatedAt = DateTime.UtcNow;


        // محاسبه مجدد
        CalculateAttendance(attendance);


        await _db.SaveChangesAsync();


        return Ok(new
        {
            message = "Attendance updated successfully."
        });
    }


    private void CalculateAttendance(Attendance attendance)
    {
        // فعلاً این قسمت را خالی می‌گذاریم.
        //
        // بعداً:
        //
        // Shift
        // CheckIn
        // CheckOut
        // Break
        //
        // ↓
        //
        // WorkedMinutes
        // LateMinutes
        // EarlyLeaveMinutes
        // OvertimeMinutes
    }
}