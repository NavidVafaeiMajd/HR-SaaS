using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class UpdateSalaryIncreaseRequestStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string? RejectionReason { get; set; }
}

[ApiController]
[Route("api/salary-increase-request")]
public class SalaryIncreaseRequestController : ControllerBase
{
    private readonly HRSaaSDbContext _context;
    private readonly UserManager<Users> _userManager;

    public SalaryIncreaseRequestController(HRSaaSDbContext context, UserManager<Users> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _context.SalaryIncreaseRequests
            .AsNoTracking()
            .Include(x => x.User)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                id = x.Id,
                userId = x.UserId,
                firstName = x.User.FirstName,
                lastName = x.User.LastName,
                personnelCode = x.User.PersonnelCode,
                currentBaseSalary = x.CurrentBaseSalary,
                requestedBaseSalary = x.RequestedBaseSalary,
                increaseAmount = x.IncreaseAmount,
                increasePercentage = x.IncreasePercentage,
                effectiveYear = x.EffectiveYear,
                effectiveMonth = x.EffectiveMonth,
                reason = x.Reason,
                status = x.Status.ToString(),
                rejectionReason = x.RejectionReason,
                approvedAt = x.ApprovedAt,
                createdAt = x.CreatedAt
            })
            .ToListAsync();

        return Ok(requests);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSalaryIncreaseRequestDto dto)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
            return Unauthorized();

        if (dto.RequestedBaseSalary <= 0)
            return BadRequest("حقوق پایهٔ درخواستی باید بیشتر از صفر باشد.");

        if (dto.EffectiveYear <= 0 || dto.EffectiveMonth < 1 || dto.EffectiveMonth > 12)
            return BadRequest("تاریخ اثر درخواست نامعتبر است.");

        var salary = await _context.EmployeeSalaries
            .FirstOrDefaultAsync(x => x.UserId == user.Id);

        if (salary == null)
            return NotFound("برای این کارمند حقوقی ثبت نشده است.");

        if (dto.RequestedBaseSalary <= salary.BaseSalary)
            return BadRequest("حقوق درخواستی باید بیشتر از حقوق پایهٔ فعلی باشد.");

        var duplicateRequest = await _context.SalaryIncreaseRequests.AnyAsync(x =>
            x.UserId == user.Id && x.Status == SalaryIncreaseRequestStatus.Pending);

        if (duplicateRequest)
            return Conflict("برای این کارمند یک درخواست در انتظار بررسی وجود دارد.");

        var increaseAmount = dto.RequestedBaseSalary - salary.BaseSalary;

        var request = new SalaryIncreaseRequest
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            CurrentBaseSalary = salary.BaseSalary,
            RequestedBaseSalary = dto.RequestedBaseSalary,
            IncreaseAmount = increaseAmount,
            IncreasePercentage = Math.Round((increaseAmount / salary.BaseSalary) * 100, 2),
            EffectiveYear = dto.EffectiveYear,
            EffectiveMonth = dto.EffectiveMonth,
            Reason = dto.Reason?.Trim(),
            Status = SalaryIncreaseRequestStatus.Pending
        };

        _context.SalaryIncreaseRequests.Add(request);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = request.Id }, new { id = request.Id });
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateSalaryIncreaseRequestStatusDto dto)
    {
        var request = await _context.SalaryIncreaseRequests.FirstOrDefaultAsync(x => x.Id == id);

        if (request == null)
            return NotFound("درخواست افزایش حقوق پیدا نشد.");

        if (request.Status != SalaryIncreaseRequestStatus.Pending)
            return BadRequest("این درخواست قبلاً نهایی شده و قابل تغییر نیست.");

        if (!Enum.TryParse<SalaryIncreaseRequestStatus>(dto.Status, true, out var status)
            || status == SalaryIncreaseRequestStatus.Pending)
            return BadRequest("وضعیت انتخاب‌شده نامعتبر است.");

        if (status == SalaryIncreaseRequestStatus.Rejected && string.IsNullOrWhiteSpace(dto.RejectionReason))
            return BadRequest("دلیل رد درخواست الزامی است.");

        request.Status = status;
        request.RejectionReason = status == SalaryIncreaseRequestStatus.Rejected
            ? dto.RejectionReason?.Trim()
            : null;
        request.ApprovedAt = status == SalaryIncreaseRequestStatus.Approved ? DateTime.UtcNow : null;
        request.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "وضعیت درخواست با موفقیت ثبت شد.", status = request.Status.ToString() });
    }
}
