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

    public AttendanceController(HRSaaSDbContext db, UserManager<Users> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [Permission(Permission.Attendance_view)]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();

        var date = DateOnly.FromDateTime(DateTime.Now);

        var weekDay = (WeekDay)(((int)date.DayOfWeek + 1) % 7);

        var employees = await _db
            .Users.Include(x => x.Shift)
                .ThenInclude(x => x.ShiftTimes)
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName,
                Shift = x.Shift,
            })
            .ToListAsync();

        var userIds = employees.Select(x => x.Id).ToList();

        var attendances = await _db
            .Attendances.Where(x => x.Date == date && userIds.Contains(x.UserId))
            .ToListAsync();

        var leaves = await _db
            .LeaveRequests.Where(x =>
                userIds.Contains(x.UserId)
                && x.StartDate <= date
                && x.EndDate >= date
                && x.Status == LeaveStatus.Approved
            )
            .ToListAsync();

        var result = employees
            .Select(employee =>
            {
                var attendance = attendances.FirstOrDefault(x => x.UserId == employee.Id);

                var leave = leaves.FirstOrDefault(x => x.UserId == employee.Id);

                var todayShiftTime = employee.Shift?.ShiftTimes.FirstOrDefault(x =>
                    x.DayOfWeek == weekDay
                );

                var isOutOfShift =
                    todayShiftTime is null
                    || todayShiftTime.StartTime is ""
                    || todayShiftTime.EndTime is "";

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

                    Description = attendance?.Description,
                };
            })
            .ToList();

        return Ok(result);
    }

    [Permission(Permission.Attendance_edit)]

    [HttpPatch("{UserId}/present")]
    public async Task<IActionResult> SetPresent(string UserId, AttendancePresentDto dto)
    {
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();

        var date = DateOnly.FromDateTime(DateTime.Now);

        // =========================
        //find user
        // =========================

        var employee = await _db
            .Users.Include(x => x.Shift)
                .ThenInclude(x => x.ShiftTimes)
            .FirstOrDefaultAsync(x => x.Id == UserId);

        if (employee is null)
            return NotFound("Employee not found.");

        // =========================
        // پیدا کردن روز هفته
        // =========================

        var weekDay = (WeekDay)(((int)date.DayOfWeek + 1) % 7);

        // =========================
        // find today ShiftTime
        // =========================

        var shiftTime = employee.Shift?.ShiftTimes.FirstOrDefault(x => x.DayOfWeek == weekDay);

        if (shiftTime is null)
        {
            return BadRequest("Employee has no shift for today.");
        }

        // =========================
        // exchange time
        // =========================

        if (!TimeOnly.TryParse(shiftTime.StartTime, out var shiftStart))
        {
            return BadRequest("Invalid shift start time.");
        }

        if (!TimeOnly.TryParse(shiftTime.EndTime, out var shiftEnd))
        {
            return BadRequest("Invalid shift end time.");
        }

        // =========================
        // exchange hour to minutes
        // =========================

        int? checkInMinutes = null;
        int? checkOutMinutes = null;

        if (dto.CheckIn.HasValue)
        {
            checkInMinutes = dto.CheckIn.Value.Hour * 60 + dto.CheckIn.Value.Minute;
        }

        if (dto.CheckOut.HasValue)
        {
            checkOutMinutes = dto.CheckOut.Value.Hour * 60 + dto.CheckOut.Value.Minute;
        }

        // =========================
        // exchange shift time to standard
        // =========================

        var shiftStartMinutes = shiftStart.Hour * 60 + shiftStart.Minute;

        var shiftEndMinutes = shiftEnd.Hour * 60 + shiftEnd.Minute;

        // =========================
        // caculate values
        // =========================

        var lateMinutes = 0;
        var earlyLeaveMinutes = 0;
        var workedMinutes = 0;
        var overtimeMinutes = 0;

        // =========================
        // value
        // =========================

        if (checkInMinutes.HasValue)
        {
            lateMinutes = Math.Max(0, checkInMinutes.Value - shiftStartMinutes);
        }

        if (checkInMinutes.HasValue && checkOutMinutes.HasValue)
        {
            // =========================
            // total work
            // =========================

            workedMinutes = Math.Max(0, checkOutMinutes.Value - checkInMinutes.Value);

            earlyLeaveMinutes = Math.Max(0, shiftEndMinutes - checkOutMinutes.Value);

            overtimeMinutes = Math.Max(0, checkOutMinutes.Value - shiftEndMinutes);
        }

        // =========================
        // today Attendance
        // =========================

        var attendance = await _db.Attendances.FirstOrDefaultAsync(x =>
            x.UserId == UserId && x.Date == date
        );

        if (attendance is null)
        {
            attendance = new Attendance
            {
                UserId = UserId,
                Date = date,

                Status = AttendanceStatus.Present,

                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,

                WorkedMinutes = workedMinutes,
                LateMinutes = lateMinutes,
                EarlyLeaveMinutes = earlyLeaveMinutes,
                OvertimeMinutes = overtimeMinutes,

                CreatedAt = DateTime.UtcNow,
            };

            _db.Attendances.Add(attendance);
        }
        else
        {
            // =========================
            // update record
            // =========================

            attendance.Status = AttendanceStatus.Present;

            attendance.CheckIn = dto.CheckIn;

            attendance.CheckOut = dto.CheckOut;

            attendance.WorkedMinutes = workedMinutes;

            attendance.LateMinutes = lateMinutes;

            attendance.EarlyLeaveMinutes = earlyLeaveMinutes;

            attendance.OvertimeMinutes = overtimeMinutes;

            attendance.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        // =========================
        // Response
        // =========================

        return Ok(
            new
            {
                message = "Attendance marked as present.",

                attendanceId = attendance.Id,

                userId = attendance.UserId,

                date = attendance.Date,

                status = attendance.Status,

                checkIn = attendance.CheckIn,

                checkOut = attendance.CheckOut,

                workedMinutes = attendance.WorkedMinutes,

                lateMinutes = attendance.LateMinutes,

                earlyLeaveMinutes = attendance.EarlyLeaveMinutes,

                overtimeMinutes = attendance.OvertimeMinutes,
            }
        );
    }

    [Permission(Permission.Attendance_edit)]
    [HttpPatch("{UserId}/absent")]
    public async Task<IActionResult> SetAbsent(string UserId, AttendanceAbsentDto dto)
    {
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();

        var date = DateOnly.FromDateTime(DateTime.Now);

        // بررسی وجود کارمند
        var employee = await _db.Users.FirstOrDefaultAsync(x => x.Id == UserId);

        if (employee is null)
            return NotFound("Employee not found.");

        // پیدا کردن Attendance امروز
        var attendance = await _db.Attendances.FirstOrDefaultAsync(x =>
            x.UserId == UserId && x.Date == date
        );

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

                CreatedAt = DateTime.UtcNow,
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

        return Ok(
            new
            {
                message = "Attendance marked as absent.",
                attendanceId = attendance.Id,
                userId = attendance.UserId,
                date = attendance.Date,
                status = attendance.Status,
                checkIn = attendance.CheckIn,
                checkOut = attendance.CheckOut,
            }
        );
    }

    [Permission(Permission.Attendance_edit)]
    [HttpPatch("{UserId}/status")]
    public async Task<IActionResult> ChangeStatus(string UserId, AttendanceStatusDto dto)
    {
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();

        var date = DateOnly.FromDateTime(DateTime.Now);

        var employee = await _db.Users.FirstOrDefaultAsync(x => x.Id == UserId);

        if (employee is null)
            return NotFound("Employee not found.");

        var attendance = await _db.Attendances.FirstOrDefaultAsync(x =>
            x.UserId == UserId && x.Date == date
        );

        if (attendance is null)
        {
            attendance = new Attendance
            {
                UserId = UserId,
                Date = date,
                Status = dto.Status,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow,
            };

            if (dto.Status != AttendanceStatus.Present)
            {
                attendance.CheckIn = null;
                attendance.CheckOut = null;
            }

            _db.Attendances.Add(attendance);
        }
        else
        {
            attendance.Status = dto.Status;
            attendance.Description = dto.Description;
            attendance.UpdatedAt = DateTime.UtcNow;

            if (dto.Status != AttendanceStatus.Present)
            {
                attendance.CheckIn = null;
                attendance.CheckOut = null;

                attendance.WorkedMinutes = 0;
                attendance.LateMinutes = 0;
                attendance.EarlyLeaveMinutes = 0;
                attendance.OvertimeMinutes = 0;
            }
        }

        await _db.SaveChangesAsync();

        return Ok(
            new
            {
                message = "Attendance status changed successfully.",
                attendanceId = attendance.Id,
                userId = attendance.UserId,
                date = attendance.Date,
                status = attendance.Status,
                checkIn = attendance.CheckIn,
                checkOut = attendance.CheckOut,
            }
        );
    }
}
