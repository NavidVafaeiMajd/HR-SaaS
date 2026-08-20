using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class UpdatePayrollPaymentStatusDto
{
    public string Status { get; set; } = string.Empty;
}

[ApiController]
[Route("api/payroll-payment")]
public class PayrollPaymentController : ControllerBase
{
    private readonly HRSaaSDbContext _context;
private readonly UserManager<Users> _userManager;
    public PayrollPaymentController(HRSaaSDbContext context , UserManager<Users> userManager)
    {
        _context = context;
        _userManager = userManager;
    }


    // ==========================================
    // GET
    // List of completed payments
    // ==========================================

    // GET:
    // api/payroll-payment?year=1405&month=5
        [Permission(Permission.Payment_view)]
    [HttpGet]
    public async Task<IActionResult> GetPayments([FromQuery] int year, [FromQuery] int month)
    {
        if (year <= 0)
            return BadRequest("سال نامعتبر است.");

        if (month < 1 || month > 12)
            return BadRequest("ماه باید بین 1 تا 12 باشد.");

        var payments = await _context
            .PayrollPayments.AsNoTracking()
            .Include(x => x.User)
            .Where(x => x.Year == year && x.Month == month)
            .OrderBy(x => x.User.FirstName)
            .Select(x => new
            {
                id = x.Id,

                userId = x.UserId,

                firstName = x.User.FirstName,
                lastName = x.User.LastName,

                personnelCode = x.User.PersonnelCode,

                year = x.Year,
                month = x.Month,

                baseSalary = x.BaseSalary,

                housingAllowance = x.HousingAllowance,

                foodAllowance = x.FoodAllowance,

                transportationAllowance = x.TransportationAllowance,

                childAllowance = x.ChildAllowance,

                seniorityAllowance = x.SeniorityAllowance,

                totalAllowances = x.TotalAllowances,

                overtimeAmount = x.OvertimeAmount,

                lateDeduction = x.LateDeduction,

                absentDeduction = x.AbsentDeduction,

                leaveDeduction = x.LeaveDeduction,

                tax = x.Tax,

                insurance = x.Insurance,

                totalDeductions = x.TotalDeductions,

                Status = x.Status,

                netSalary = x.NetSalary,

                paidAt = x.PaidAt,
            })
            .ToListAsync();

        return Ok(
            new
            {
                year,
                month,

                count = payments.Count,

                items = payments,
            }
        );
    }

    [Permission(Permission.Payment_edit)]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] UpdatePayrollPaymentStatusDto dto
    )
    {
        var payment = await _context.PayrollPayments.FirstOrDefaultAsync(x => x.Id == id);

        if (payment == null)
        {
            return NotFound("رکورد پرداخت پیدا نشد.");
        }

        if (!Enum.TryParse<PayrollPaymentStatus>(dto.Status, true, out var status))
        {
            return BadRequest("وضعیت نامعتبر است. وضعیت باید Pending، IsPaid یا Canceled باشد.");
        }

        payment.Status = status;
        payment.UpdatedAt = DateTime.UtcNow;
        payment.PaidAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(
            new
            {
                message = "وضعیت پرداخت با موفقیت تغییر کرد.",
                id = payment.Id,
                status = payment.Status.ToString(),
            }
        );
    }

    // ==========================================
    // GET BY ID
    // ==========================================

    // GET:
    // api/payroll-payment/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPayment(Guid id)
    {
        var payment = await _context
            .PayrollPayments.AsNoTracking()
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (payment == null)
            return NotFound("پرداخت حقوق پیدا نشد.");
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();

        if (manager.dashboardType == DashboardType.employee && manager.Id != payment.UserId)
            return BadRequest();

        return Ok(
            new
            {
                id = payment.Id,

                userId = payment.UserId,

                firstName = payment.User.FirstName,

                lastName = payment.User.LastName,

                personnelCode = payment.User.PersonnelCode,

                year = payment.Year,
                month = payment.Month,

                baseSalary = payment.BaseSalary,

                housingAllowance = payment.HousingAllowance,

                foodAllowance = payment.FoodAllowance,

                transportationAllowance = payment.TransportationAllowance,

                childAllowance = payment.ChildAllowance,

                seniorityAllowance = payment.SeniorityAllowance,

                totalAllowances = payment.TotalAllowances,

                overtimeAmount = payment.OvertimeAmount,

                lateDeduction = payment.LateDeduction,

                absentDeduction = payment.AbsentDeduction,

                leaveDeduction = payment.LeaveDeduction,

                tax = payment.Tax,

                insurance = payment.Insurance,

                totalDeductions = payment.TotalDeductions,

                netSalary = payment.NetSalary,

                paidAt = payment.PaidAt,
            }
        );
    }

    // ==========================================
    // POST
    // Create payment
    // ==========================================

    // POST:
    // api/payroll-payment
        [Permission(Permission.Payment_post)]
    [HttpPost]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePayrollPaymentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserId))
            return BadRequest("کارمند مشخص نشده است.");

        if (dto.Year <= 0)
            return BadRequest("سال نامعتبر است.");

        if (dto.Month < 1 || dto.Month > 12)
            return BadRequest("ماه نامعتبر است.");

        // ==========================================
        // Check employee
        // ==========================================

        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == dto.UserId);

        if (user == null)
            return NotFound("کارمند پیدا نشد.");

        // ==========================================
        // Prevent duplicate payment
        // ==========================================

        var alreadyPaid = await _context.PayrollPayments.AnyAsync(x =>
            x.UserId == dto.UserId && x.Year == dto.Year && x.Month == dto.Month
        );

        if (alreadyPaid)
        {
            return Conflict("حقوق این کارمند برای این ماه قبلاً پرداخت شده است.");
        }

        // ==========================================
        // Create payment snapshot
        // ==========================================

        var payment = new PayrollPayment
        {
            Id = Guid.NewGuid(),

            UserId = dto.UserId,

            Year = dto.Year,
            Month = dto.Month,

            BaseSalary = dto.BaseSalary,

            HousingAllowance = dto.HousingAllowance,

            FoodAllowance = dto.FoodAllowance,

            TransportationAllowance = dto.TransportationAllowance,

            ChildAllowance = dto.ChildAllowance,

            SeniorityAllowance = dto.SeniorityAllowance,

            TotalAllowances = dto.TotalAllowances,

            OvertimeAmount = dto.OvertimeAmount,

            LateDeduction = dto.LateDeduction,

            AbsentDeduction = dto.AbsentDeduction,

            LeaveDeduction = dto.LeaveDeduction,

            Tax = dto.Tax,

            Insurance = dto.Insurance,

            TotalDeductions = dto.TotalDeductions,

            NetSalary = dto.NetSalary,

            Status = PayrollPaymentStatus.Pending,

            PaidAt = null,
        };

        _context.PayrollPayments.Add(payment);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetPayment),
            new { id = payment.Id },
            new
            {
                message = "پرداخت حقوق با موفقیت ثبت شد.",

                id = payment.Id,

                userId = payment.UserId,

                year = payment.Year,
                month = payment.Month,

                netSalary = payment.NetSalary,

                paidAt = payment.PaidAt,
            }
        );
    }
}
