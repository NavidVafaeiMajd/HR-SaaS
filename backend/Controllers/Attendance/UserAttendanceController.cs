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

            Name = user.FirstName + " " +user.LastName,

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
}
