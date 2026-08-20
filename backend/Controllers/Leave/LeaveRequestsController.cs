using System.Globalization;
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
    private readonly IEventPublisher _publisher;

    public LeaveRequestsController(
        HRSaaSDbContext db,
        UserManager<Users> userManager,
        IEventPublisher publisher
    )
    {
        _db = db;
        _userManager = userManager;
        _publisher = publisher;
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
            TotalDays = TotalDays,
            Status = LeaveStatus.Approved,
        };

        _db.LeaveRequests.Add(request);

        await _db.SaveChangesAsync();

        var user = await _userManager.FindByIdAsync(dto.UserId);
        var createBy = await _userManager.GetUserAsync(User);

        await _publisher.PublishAsync(
            new LeaveRequestedEvent(
                dto.UserId,
                request.Id,
                new[] { Permission.Leave_post },
                $"{user.FirstName} {user.LastName}",
                new[] { "Admin" },
                $"{createBy.FirstName} {createBy.LastName}",
                request.Status
            )
        );

        return Ok(request.Id);
    }

    [Permission(Permission.Leave_view)]
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
                    x.User.Id,
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
    [HttpGet("my/report")]
    public async Task<IActionResult> MyLeaveReport()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var year = today.Year;

        var activeLeave = await _db
            .LeaveRequests.AsNoTracking()
            .Where(x =>
                x.UserId == user.Id
                && x.Status == LeaveStatus.Approved
                && x.StartDate <= today
                && x.EndDate >= today
            )
            .OrderBy(x => x.EndDate)
            .Select(x => new
            {
                x.Id,

                LeaveType = new { x.LeaveType.Id, x.LeaveType.Name },

                x.StartDate,
                x.EndDate,
                x.TotalDays,

                RemainingDays = x.EndDate.DayNumber - today.DayNumber + 1,
            })
            .FirstOrDefaultAsync();

        var leaveTypes = await _db
            .LeaveTypes.AsNoTracking()
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.AnnualLimit,
            })
            .ToListAsync();

        var usedLeaves = await _db
            .LeaveRequests.AsNoTracking()
            .Where(x =>
                x.UserId == user.Id && x.Status == LeaveStatus.Approved && x.StartDate.Year == year
            )
            .GroupBy(x => x.LeaveTypeId)
            .Select(g => new { LeaveTypeId = g.Key, UsedDays = g.Sum(x => x.TotalDays) })
            .ToListAsync();

        var remainingLeaves = leaveTypes
            .Select(type =>
            {
                var used = usedLeaves.FirstOrDefault(x => x.LeaveTypeId == type.Id);

                var usedDays = used?.UsedDays ?? 0;

                return new
                {
                    LeaveTypeId = type.Id,

                    LeaveTypeName = type.Name,

                    AnnualLimit = type.AnnualLimit,

                    UsedDays = usedDays,

                    RemainingDays = Math.Max(0, type.AnnualLimit - usedDays),
                };
            })
            .ToList();

        return Ok(
            new
            {
                ActiveLeave = activeLeave,

                RemainingLeaves = remainingLeaves,
            }
        );
    }

    [Authorize]
    [HttpGet("my/monthly")]
    public async Task<IActionResult> GetUserMonthlyReport(int year, int month)
    {
        if (month < 1 || month > 12)
            return BadRequest("ماه نامعتبر است.");

        var user = await _userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        var pc = new PersianCalendar();

        var startDate = pc.ToDateTime(year, month, 1, 0, 0, 0, 0);

        var endDate =
            month == 12
                ? pc.ToDateTime(year + 1, 1, 1, 0, 0, 0, 0).AddDays(-1)
                : pc.ToDateTime(year, month + 1, 1, 0, 0, 0, 0).AddDays(-1);

        var start = DateOnly.FromDateTime(startDate);
        var end = DateOnly.FromDateTime(endDate);

        var requests = await _db
            .LeaveRequests.AsNoTracking()
            .Include(x => x.LeaveType)
            .Where(x => x.UserId == user.Id && x.StartDate <= end && x.EndDate >= start)
            .ToListAsync();

        var report = requests
            .Select(x =>
            {
                var effectiveStart = x.StartDate > start ? x.StartDate : start;

                var effectiveEnd = x.EndDate < end ? x.EndDate : end;

                var days = effectiveEnd.DayNumber - effectiveStart.DayNumber + 1;

                return new
                {
                    x.Id,
                    LeaveTypeId = x.LeaveTypeId,
                    LeaveTypeName = x.LeaveType.Name,
                    StartDate = effectiveStart,
                    EndDate = effectiveEnd,
                    Status = x.Status,
                    TotalDays = days,
                };
            })
            .ToList();
        var approvedReport = report.Where(x => x.Status == LeaveStatus.Approved).ToList();

        var byLeaveType = approvedReport
            .GroupBy(x => new { x.LeaveTypeId, x.LeaveTypeName })
            .Select(g => new
            {
                leaveTypeId = g.Key.LeaveTypeId,
                leaveTypeName = g.Key.LeaveTypeName,
                requestCount = g.Count(),
                totalDays = g.Sum(x => x.TotalDays),
            })
            .ToList();

        return Ok(
            new
            {
                user = new { id = user.Id, name = $"{user.FirstName} {user.LastName}" },

                month = new { year, month },

                summary = new
                {
                    totalRequests = approvedReport.Count,
                    totalDays = approvedReport.Sum(x => x.TotalDays),
                },

                byLeaveType,

                requests = report,
            }
        );
    }

    [Authorize]
    [HttpPost("my")]
    public async Task<IActionResult> CreateMyLeaveRequest(CreateMyLeaveRequestDto dto)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        if (dto.EndDate < dto.StartDate)
            return BadRequest("تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.");

        var leaveType = await _db.LeaveTypes.FirstOrDefaultAsync(x => x.Id == dto.LeaveTypeId);

        if (leaveType is null)
            return NotFound("نوع مرخصی پیدا نشد.");

        // محاسبه تعداد روزها
        var totalDays = dto.EndDate.DayNumber - dto.StartDate.DayNumber + 1;

        if (totalDays <= 0)
            return BadRequest("بازه تاریخ نامعتبر است.");

        // سال مرخصی
        var year = dto.StartDate.Year;

        // مرخصی‌های تایید شده کارمند در همان سال و همان نوع
        var usedDays = await _db
            .LeaveRequests.Where(x =>
                x.UserId == user.Id
                && x.LeaveTypeId == dto.LeaveTypeId
                && x.Status == LeaveStatus.Approved
                && x.StartDate.Year == year
            )
            .SumAsync(x => x.TotalDays);

        var remainingDays = Math.Max(0, leaveType.AnnualLimit - usedDays);

        if (totalDays > remainingDays)
        {
            return BadRequest($"تعداد روزهای باقی‌مانده مرخصی شما {remainingDays} روز است.");
        }

        // جلوگیری از درخواست هم‌پوشان
        var hasOverlap = await _db.LeaveRequests.AnyAsync(x =>
            x.UserId == user.Id
            && (x.Status == LeaveStatus.Pending || x.Status == LeaveStatus.Approved)
            && x.StartDate <= dto.EndDate
            && x.EndDate >= dto.StartDate
        );

        if (hasOverlap)
        {
            return BadRequest("در این بازه زمانی یک درخواست مرخصی دیگر دارید.");
        }

        var request = new LeaveRequest
        {
            UserId = user.Id,

            LeaveTypeId = dto.LeaveTypeId,

            StartDate = dto.StartDate,

            EndDate = dto.EndDate,

            TotalDays = totalDays,

            Reason = dto.Reason,

            Status = LeaveStatus.Pending,
        };

        _db.LeaveRequests.Add(request);

        await _db.SaveChangesAsync();


        await _publisher.PublishAsync(
            new LeaveRequestedEvent(
                user.Id,
                request.Id,
                new[] { Permission.Leave_post },
                $"{user.FirstName} {user.LastName}",
                new[] { "Admin" },
                $"{user.FirstName} {user.LastName}",
                request.Status
            )
        );
        return Ok(
            new
            {
                id = request.Id,
                message = "درخواست مرخصی با موفقیت ثبت شد.",
                totalDays,
                remainingDays,
            }
        );
    }

    [Permission(Permission.Leave_edit)]
    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateLeaveRequestDto dto)
    {
        var request = await _db.LeaveRequests.FirstOrDefaultAsync(x => x.Id == id);

        if (request is null)
            return NotFound();

        if (request.Status != LeaveStatus.Pending)
            return BadRequest("Only pending requests can be edited");

        var leaveType = await _db.LeaveTypes.FirstOrDefaultAsync(x => x.Id == dto.LeaveTypeId);

        if (leaveType is null)
            return NotFound("Leave type not found");

        var totalDays = dto.EndDate.DayNumber - dto.StartDate.DayNumber + 1;

        request.LeaveTypeId = dto.LeaveTypeId;

        request.StartDate = dto.StartDate;

        request.EndDate = dto.EndDate;

        request.TotalDays = totalDays;

        request.Reason = dto.Reason;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpGet("details/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var request = await _db
            .LeaveRequests.AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,

                User = new
                {
                    x.User.Id,
                    x.User.UserName,
                    x.User.Email,
                },

                LeaveType = new { x.LeaveType.Id, x.LeaveType.Name },

                x.StartDate,
                x.EndDate,
                x.TotalDays,
                x.Reason,
                x.Status,

                ApprovedBy = x.ApprovedBy == null
                    ? null
                    : new { x.ApprovedBy.Id, x.ApprovedBy.UserName },

                x.ApprovalComment,
                x.ApprovedAt,
                x.CreatedAt,
            })
            .FirstOrDefaultAsync();

        if (request is null)
            return NotFound();

        return Ok(request);
    }

    [Permission(Permission.Leave_delete)]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var request = await _db.LeaveRequests.FirstOrDefaultAsync(x => x.Id == id);

        if (request is null)
            return NotFound();

        if (request.Status != LeaveStatus.Pending)
            return BadRequest("Only pending requests can be deleted");

        _db.LeaveRequests.Remove(request);

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [Permission(Permission.Leave_edit)]
    [HttpPatch("{id}/approve")]
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

        var user = await _userManager.FindByIdAsync(request.UserId);

        await _publisher.PublishAsync(
            new LeaveRequestedEvent(
                request.UserId,
                request.Id,
                new[] { Permission.Leave_post },
                $"{user.FirstName} {user.LastName}",
                new[] { "Admin" },
                $"{approver.FirstName} {approver.LastName}",
                request.Status
            )
        );
        return NoContent();
    }

    [Permission(Permission.Leave_edit)]
    [HttpPatch("{id}/reject")]
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

        var user = await _userManager.FindByIdAsync(request.UserId);

        await _publisher.PublishAsync(
            new LeaveRequestedEvent(
                request.UserId,
                request.Id,
                new[] { Permission.Leave_post },
                $"{user.FirstName} {user.LastName}",
                new[] { "Admin" },
                $"{approver.FirstName} {approver.LastName}",
                request.Status
            )
        );
        return NoContent();
    }

    [Permission(Permission.Leave_edit)]
    [HttpPatch("{id}/cancel")]
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


        await _publisher.PublishAsync(
            new LeaveRequestedEvent(
                request.UserId,
                request.Id,
                new[] { Permission.Leave_post },
                $"{user.FirstName} {user.LastName}",
                new[] { "Admin" },
                $"{user.FirstName} {user.LastName}",
                request.Status
            )
        );
        return NoContent();
    }

    [Permission(Permission.Leave_view)]
    [HttpGet("report")]
    public async Task<IActionResult> GetReport()
    {
        var totalRequests = await _db.LeaveRequests.CountAsync();

        var pendingRequests = await _db.LeaveRequests.CountAsync(x =>
            x.Status == LeaveStatus.Pending
        );

        var approvedRequests = await _db.LeaveRequests.CountAsync(x =>
            x.Status == LeaveStatus.Approved
        );

        var rejectedRequests = await _db.LeaveRequests.CountAsync(x =>
            x.Status == LeaveStatus.Rejected
        );

        var canceledRequests = await _db.LeaveRequests.CountAsync(x =>
            x.Status == LeaveStatus.Canceled
        );
        return Ok(
            new
            {
                total = totalRequests,

                pending = pendingRequests,

                approved = approvedRequests,

                rejected = rejectedRequests,

                canceled = canceledRequests,
            }
        );
    }
}
