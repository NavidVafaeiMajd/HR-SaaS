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

    // GET: api/employee-salary
    [Permission(Permission.Payment_view)]
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

                x.EffectiveYear,
                x.EffectiveMonth,

                x.CreatedAt,
                x.UpdatedAt,
            })
            .ToListAsync();

        return Ok(salaries);
    }

    // GET: api/employee-salary/{id}
    [Permission(Permission.Payment_view)]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var salary = await _context
            .EmployeeSalaries.AsNoTracking()
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (salary == null)
            return NotFound("حقوق کارمند پیدا نشد.");

        return Ok(salary);
    }

    // DELETE: api/employee-salary/{id}
    [Permission(Permission.Payment_delete)]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var salary = await _context
            .EmployeeSalaries.Include(x => x.History)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (salary == null)
            return NotFound("حقوق کارمند پیدا نشد.");

        // اگر سابقه حقوق دارد، اجازه حذف نده
        if (salary.History.Any())
        {
            return BadRequest("این حقوق دارای سابقه تغییرات است و امکان حذف آن وجود ندارد.");
        }

        _context.EmployeeSalaries.Remove(salary);

        await _context.SaveChangesAsync();

        return Ok(new { message = "حقوق کارمند با موفقیت حذف شد." });
    }

    // POST: api/employee-salary
    [Permission(Permission.Payment_post)]
    [HttpPost]
    public async Task<IActionResult> Create(CreateEmployeeSalaryDto dto)
    {
        // بررسی کارمند
        var userExists = await _context.Users.AnyAsync(x => x.Id == dto.UserId);

        if (!userExists)
            return BadRequest("کارمند پیدا نشد.");

        // بررسی اینکه کارمند قبلاً حقوق دارد یا نه
        var salaryExists = await _context.EmployeeSalaries.AnyAsync(x => x.UserId == dto.UserId);

        if (salaryExists)
        {
            return BadRequest("برای این کارمند قبلاً حقوق ثبت شده است.");
        }

        // اعتبارسنجی ماه
        if (dto.EffectiveMonth < 1 || dto.EffectiveMonth > 12)
        {
            return BadRequest("ماه وارد شده نامعتبر است.");
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

            BankName = dto.BankName,
            AccountHolderName = dto.AccountHolderName,
            AccountNumber = dto.AccountNumber,
            CardNumber = dto.CardNumber,
            ShebaNumber = dto.ShebaNumber,

            EffectiveYear = dto.EffectiveYear,
            EffectiveMonth = dto.EffectiveMonth,

            CreatedAt = DateTime.UtcNow,
        };
        _context.EmployeeSalaries.Add(salary);

        await _context.SaveChangesAsync();

        return Ok(new { message = "حقوق کارمند با موفقیت ثبت شد.", salary.Id });
    }

    // PUT: api/employee-salary/{userId}/increase
    [Permission(Permission.Payment_edit)]
    [HttpPatch("{userId}/increase")]
    public async Task<IActionResult> IncreaseSalary(string userId, UpdateEmployeeSalaryDto dto)
    {
        // حقوق فعلی کارمند
        var currentSalary = await _context
            .EmployeeSalaries.Include(x => x.History)
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (currentSalary == null)
        {
            return NotFound("برای این کارمند هنوز حقوقی ثبت نشده است.");
        }

        // اعتبارسنجی ماه
        if (dto.EffectiveMonth < 1 || dto.EffectiveMonth > 12)
        {
            return BadRequest("ماه وارد شده نامعتبر است.");
        }

        /*
         * تاریخ حقوق جدید باید بعد از
         * تاریخ شروع حقوق فعلی باشد.
         */
        if (
            dto.EffectiveYear < currentSalary.EffectiveYear
            || (
                dto.EffectiveYear == currentSalary.EffectiveYear
                && dto.EffectiveMonth <= currentSalary.EffectiveMonth
            )
        )
        {
            return BadRequest("تاریخ شروع حقوق جدید باید بعد از تاریخ حقوق فعلی باشد.");
        }

        /*
         * ذخیره Snapshot حقوق فعلی
         * قبل از تغییر
         */
        var history = new EmployeeSalaryHistory
        {
            Id = Guid.NewGuid(),

            EmployeeSalaryId = currentSalary.Id,

            BaseSalary = currentSalary.BaseSalary,

            HousingAllowance = currentSalary.HousingAllowance,

            FoodAllowance = currentSalary.FoodAllowance,

            TransportationAllowance = currentSalary.TransportationAllowance,

            ChildAllowance = currentSalary.ChildAllowance,

            SeniorityAllowance = currentSalary.SeniorityAllowance,

            LatePerHour = currentSalary.LatePerHour,

            LeavePerDay = currentSalary.LeavePerDay,

            AbsentPerDay = currentSalary.AbsentPerDay,

            OvertimePerHour = currentSalary.OvertimePerHour,

            Tax = currentSalary.Tax,

            Insurance = currentSalary.Insurance,

            EffectiveYear = currentSalary.EffectiveYear,

            EffectiveMonth = currentSalary.EffectiveMonth,

            CreatedAt = DateTime.UtcNow,
        };

        _context.EmployeeSalaryHistories.Add(history);

        /*
         * آپدیت حقوق فعلی
         */
        currentSalary.BaseSalary = dto.BaseSalary;

        currentSalary.HousingAllowance = dto.HousingAllowance;

        currentSalary.FoodAllowance = dto.FoodAllowance;

        currentSalary.TransportationAllowance = dto.TransportationAllowance;

        currentSalary.ChildAllowance = dto.ChildAllowance;

        currentSalary.SeniorityAllowance = dto.SeniorityAllowance;

        currentSalary.LatePerHour = dto.LatePerHour;

        currentSalary.LeavePerDay = dto.LeavePerDay;

        currentSalary.AbsentPerDay = dto.AbsentPerDay;

        currentSalary.OvertimePerHour = dto.OvertimePerHour;

        currentSalary.Tax = dto.Tax;

        currentSalary.Insurance = dto.Insurance;

        currentSalary.EffectiveYear = dto.EffectiveYear;

        currentSalary.EffectiveMonth = dto.EffectiveMonth;

        currentSalary.UpdatedAt = DateTime.UtcNow;

        currentSalary.BankName = dto.BankName;
        currentSalary.AccountHolderName = dto.AccountHolderName;
        currentSalary.AccountNumber = dto.AccountNumber;
        currentSalary.CardNumber = dto.CardNumber;
        currentSalary.ShebaNumber = dto.ShebaNumber;

        await _context.SaveChangesAsync();

        return Ok(new { message = "حقوق کارمند با موفقیت تغییر کرد." });
    }
}
