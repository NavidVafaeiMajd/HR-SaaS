using HrSaaS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/employee-salary")]
public class EmployeeSalaryController : ControllerBase
{
    private readonly HRSaaSDbContext _context;

    public EmployeeSalaryController(HRSaaSDbContext context)
    {
        _context = context;
    }

    // =========================
    // Create Initial Salary
    // =========================

    [HttpPost]
    public async Task<IActionResult> CreateSalary(CreateEmployeeSalaryDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == dto.UserId);

        if (user == null)
            return NotFound("کاربر پیدا نشد.");

        var existingSalary = await _context.EmployeeSalaries.FirstOrDefaultAsync(x =>
            x.UserId == dto.UserId
        );

        if (existingSalary != null)
        {
            return Conflict("برای این کاربر قبلاً حقوق ثبت شده است.");
        }

        var salary = new EmployeeSalary
        {
            Id = Guid.NewGuid(),

            UserId = dto.UserId,

            BaseSalary = dto.BaseSalary,

            HousingAllowance = dto.HousingAllowance,
            FoodAllowance = dto.FoodAllowance,
            TransportationAllowance = dto.TransportationAllowance,
            ChildAllowance = dto.ChildAllowance,
            SeniorityAllowance = dto.SeniorityAllowance,

            LatePerHour = dto.LatePerHour,
            LeavePerDay = dto.LeavePerDay,
            AbsentPerDay = dto.AbsentPerDay,
            OvertimePerHour = dto.OvertimePerHour,

            Tax = dto.Tax,
            Insurance = dto.Insurance,

            EffectiveFrom = dto.EffectiveFrom,

            CreatedAt = DateTime.UtcNow,
        };

        var history = new EmployeeSalaryHistory
        {
            Id = Guid.NewGuid(),

            EmployeeSalaryId = salary.Id,

            BaseSalary = salary.BaseSalary,

            HousingAllowance = salary.HousingAllowance,
            FoodAllowance = salary.FoodAllowance,
            TransportationAllowance = salary.TransportationAllowance,
            ChildAllowance = salary.ChildAllowance,
            SeniorityAllowance = salary.SeniorityAllowance,

            LatePerHour = salary.LatePerHour,
            LeavePerDay = salary.LeavePerDay,
            AbsentPerDay = salary.AbsentPerDay,
            OvertimePerHour = salary.OvertimePerHour,

            Tax = salary.Tax,
            Insurance = salary.Insurance,

            EffectiveFrom = salary.EffectiveFrom,
            EffectiveTo = null,

            ChangeReason = "Initial Salary",

            CreatedAt = DateTime.UtcNow,
        };

        _context.EmployeeSalaries.Add(salary);
        _context.EmployeeSalaryHistories.Add(history);

        await _context.SaveChangesAsync();

return CreatedAtAction(
    nameof(GetByUserId),
    new { userId = dto.UserId },
    new
    {
        salary.Id,
        salary.UserId,
        salary.BaseSalary,

        salary.HousingAllowance,
        salary.FoodAllowance,
        salary.TransportationAllowance,
        salary.ChildAllowance,
        salary.SeniorityAllowance,

        salary.LatePerHour,
        salary.LeavePerDay,
        salary.AbsentPerDay,
        salary.OvertimePerHour,

        salary.Tax,
        salary.Insurance,

        salary.EffectiveFrom,
        salary.EffectiveTo,

        salary.CreatedAt,
        salary.UpdatedAt
    }
);    }

    // =========================
    // Increase / Change Salary
    // =========================

    [HttpPost("{userId}/increase")]
    public async Task<IActionResult> IncreaseSalary(string userId, IncreaseSalaryDto dto)
    {
        var salary = await _context.EmployeeSalaries.FirstOrDefaultAsync(x => x.UserId == userId);

        if (salary == null)
        {
            return NotFound("برای این کاربر هنوز حقوقی ثبت نشده است.");
        }

        // بررسی تاریخ تکراری
        var duplicateDate = await _context.EmployeeSalaryHistories.AnyAsync(x =>
            x.EmployeeSalaryId == salary.Id && x.EffectiveFrom == dto.EffectiveFrom
        );

        if (duplicateDate)
        {
            return Conflict("برای این تاریخ قبلاً یک حقوق ثبت شده است.");
        }

        var currentHistory = await _context.EmployeeSalaryHistories.FirstOrDefaultAsync(x =>
            x.EmployeeSalaryId == salary.Id && x.EffectiveTo == null
        );

        if (currentHistory == null)
        {
            return BadRequest("رکورد فعلی حقوق در تاریخچه پیدا نشد.");
        }

        if (dto.EffectiveFrom <= currentHistory.EffectiveFrom)
        {
            return BadRequest("تاریخ شروع حقوق جدید باید بعد از تاریخ شروع حقوق فعلی باشد.");
        }

        currentHistory.EffectiveTo = dto.EffectiveFrom.AddDays(-1);

        salary.BaseSalary = dto.BaseSalary;

        salary.HousingAllowance = dto.HousingAllowance;

        salary.FoodAllowance = dto.FoodAllowance;

        salary.TransportationAllowance = dto.TransportationAllowance;

        salary.ChildAllowance = dto.ChildAllowance;

        salary.SeniorityAllowance = dto.SeniorityAllowance;

        salary.LatePerHour = dto.LatePerHour;

        salary.LeavePerDay = dto.LeavePerDay;

        salary.AbsentPerDay = dto.AbsentPerDay;

        salary.OvertimePerHour = dto.OvertimePerHour;

        salary.EffectiveFrom = dto.EffectiveFrom;

        salary.UpdatedAt = DateTime.UtcNow;

        var newHistory = new EmployeeSalaryHistory
        {
            Id = Guid.NewGuid(),

            EmployeeSalaryId = salary.Id,

            BaseSalary = salary.BaseSalary,

            HousingAllowance = salary.HousingAllowance,
            FoodAllowance = salary.FoodAllowance,
            TransportationAllowance = salary.TransportationAllowance,
            ChildAllowance = salary.ChildAllowance,
            SeniorityAllowance = salary.SeniorityAllowance,

            LatePerHour = salary.LatePerHour,
            LeavePerDay = salary.LeavePerDay,
            AbsentPerDay = salary.AbsentPerDay,
            OvertimePerHour = salary.OvertimePerHour,

            Tax = salary.Tax,
            Insurance = salary.Insurance,

            EffectiveFrom = salary.EffectiveFrom,
            EffectiveTo = null,

            ChangeReason = dto.ChangeReason,

            CreatedAt = DateTime.UtcNow,
        };

        _context.EmployeeSalaryHistories.Add(newHistory);

        await _context.SaveChangesAsync();

        return Ok(salary);
    }

    // =========================
    // Get By User
    // =========================

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        var salary = await _context
            .EmployeeSalaries.Include(x => x.History)
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (salary == null)
            return NotFound();

        return Ok(salary);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var salaries = await _context
            .EmployeeSalaries.AsNoTracking()
            .Include(x => x.User)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.UserId,

                User = new
                {
                    x.User.Id,
                    x.User.FirstName,
                    x.User.LastName,
                },

                x.BaseSalary,

                x.HousingAllowance,
                x.FoodAllowance,
                x.TransportationAllowance,
                x.ChildAllowance,
                x.SeniorityAllowance,

                x.LatePerHour,
                x.LeavePerDay,
                x.AbsentPerDay,
                x.OvertimePerHour,

                x.Tax,
                x.Insurance,

                x.EffectiveFrom,

                x.CreatedAt,
                x.UpdatedAt,
            })
            .ToListAsync();

        return Ok(salaries);
    }
}
