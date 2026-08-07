using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/leave-list")]
public class LeaveRequestsController : ControllerBase
{
    private readonly HRSaaSDbContext _db;
    private readonly UserManager<Users> _userManager;

    public LeaveRequestsController(HRSaaSDbContext db, UserManager<Users> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateLeaveRequestDto dto)
    {
        if (dto.UserId is null)
            return Unauthorized();

        var leaveType = await _db.LeaveTypes.FirstOrDefaultAsync(x => x.Id == dto.LeaveTypeId);

        if (leaveType is null)
            return NotFound("Leave type not found");

        var TotalDays = dto.EndDate.DayNumber - dto.StartDate.DayNumber + 1;

        var usedDays = await _db
            .LeaveRequests.Where(x =>
                x.UserId == dto.UserId
                && x.LeaveTypeId == dto.LeaveTypeId
                && x.Status == LeaveStatus.Approved
                && x.StartDate.Year == DateTime.UtcNow.Year
            )
            .SumAsync(x => x.TotalDays);

        var remaining = leaveType.AnnualLimit - usedDays;

        if (TotalDays > remaining)
        {
            return BadRequest($"Remaining leave is {remaining} days");
        }

        var request = new LeaveRequest
        {
            UserId = dto.UserId,

            LeaveTypeId = dto.LeaveTypeId,

            StartDate = dto.StartDate,

            EndDate = dto.EndDate,
            Reason = dto.Reason,

            Status = LeaveStatus.Pending,
        };

        _db.LeaveRequests.Add(request);

        await _db.SaveChangesAsync();

        return Ok(request.Id);
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _db
            .LeaveRequests.AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.LeaveType)
            .Include(x => x.ApprovedBy)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,

                User = new
                {
                    x.User.FirstName,
                    x.User.LastName,
                },

                LeaveType = new { x.LeaveType.Id, x.LeaveType.Name },

                x.StartDate,
                x.EndDate,
                x.Reason,
                x.Status,
                x.TotalDays,
                ApprovedBy = x.ApprovedBy == null
                    ? null
                    : new { x.ApprovedBy.Id, x.ApprovedBy.UserName },

                x.ApprovalComment,
                x.ApprovedAt,
                x.CreatedAt,
                x.UpdatedAt,
            })
            .ToListAsync();

        return Ok(requests);
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> MyRequests()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        var requests = await _db
            .LeaveRequests.Include(x => x.LeaveType)
            .Where(x => x.UserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(requests);
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var approver = await _userManager.GetUserAsync(User);

        if (approver is null)
            return Unauthorized();

        var request = await _db.LeaveRequests.FirstOrDefaultAsync(x => x.Id == id);

        if (request is null)
            return NotFound();

        if (request.Status != LeaveStatus.Pending)
            return BadRequest("Request already processed");

        request.Status = LeaveStatus.Approved;

        request.ApprovedById = approver.Id;

        request.ApprovedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(Guid id, RejectLeaveRequestDto dto)
    {
        var approver = await _userManager.GetUserAsync(User);

        if (approver is null)
            return Unauthorized();

        var request = await _db.LeaveRequests.FirstOrDefaultAsync(x => x.Id == id);

        if (request is null)
            return NotFound();

        if (request.Status != LeaveStatus.Pending)
            return BadRequest("Request already processed");

        request.Status = LeaveStatus.Rejected;

        request.ApprovedById = approver.Id;

        request.ApprovalComment = dto.Comment;

        request.ApprovedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // لغو درخواست توسط کارمند
    [Authorize]
    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        var request = await _db.LeaveRequests.FirstOrDefaultAsync(x =>
            x.Id == id && x.UserId == user.Id
        );

        if (request is null)
            return NotFound();

        if (request.Status != LeaveStatus.Pending)
            return BadRequest("Only pending requests can be cancelled");

        request.Status = LeaveStatus.Canceled;

        await _db.SaveChangesAsync();

        return NoContent();
    }
}
