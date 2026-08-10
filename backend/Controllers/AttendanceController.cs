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


    // GET: api/attendance?date=2026-08-10
    [HttpGet]
    public async Task<IActionResult> Get(DateOnly date)
    {
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();


        var employees = await _db.Users
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName
            })
            .ToListAsync();


        var attendances = await _db.Attendances
            .Where(x =>
                x.Date == date &&
                employees.Select(e => e.Id).Contains(x.UserId))
            .ToListAsync();


        var result = employees.Select(employee =>
        {
            var attendance = attendances
                .FirstOrDefault(x => x.UserId == employee.Id);

            return new AttendanceListDto
            {
                UserId = employee.Id,

                FirstName = employee.FirstName,
                LastName = employee.LastName,

                AttendanceId = attendance?.Id,

                Status = attendance?.Status,

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


    // POST: api/attendance
    [HttpPost]
    public async Task<IActionResult> Create(
        AttendanceCreateDto dto)
    {
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();


        var employee = await _db.Users
            .FirstOrDefaultAsync(x =>
                x.Id == dto.UserId );

        if (employee is null)
            return Forbid();


        var exists = await _db.Attendances
            .AnyAsync(x =>
                x.UserId == dto.UserId &&
                x.Date == dto.Date);

        if (exists)
        {
            return Conflict(new
            {
                message = "Attendance already exists for this employee and date."
            });
        }


        var attendance = new Attendance
        {
            UserId = dto.UserId,
            Date = dto.Date,

            Status = dto.Status,

            CheckIn = dto.CheckIn,
            CheckOut = dto.CheckOut,

            Description = dto.Description,

            CreatedAt = DateTime.UtcNow
        };


        // محاسبات فعلاً بعداً اضافه می‌شوند
        CalculateAttendance(attendance);


        _db.Attendances.Add(attendance);

        await _db.SaveChangesAsync();


        return Ok(new
        {
            message = "Attendance created successfully.",
            id = attendance.Id
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