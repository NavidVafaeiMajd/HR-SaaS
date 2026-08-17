using System.Globalization;
using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/payroll-details")]
[Authorize]
public class PayrollDetailsController : ControllerBase
{
    private readonly HRSaaSDbContext _context;
private readonly UserManager<Users> _userManager;
    public PayrollDetailsController(HRSaaSDbContext context , UserManager<Users> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET: api/payroll-details/{userId}
    // Returns the salary that is effective today, plus the employee's paid-payment report.
[HttpGet("{userId}")]
public async Task<IActionResult> GetEmployeePayrollDetails(string userId)
{
    if (string.IsNullOrWhiteSpace(userId))
        return BadRequest("کارمند مشخص نشده است.");
        var manager = await _userManager.GetUserAsync(User);

        if (manager is null)
            return Unauthorized();

        if (manager.dashboardType == DashboardType.employee && manager.Id != userId)
            return BadRequest();

    var salary = await _context.EmployeeSalaries
        .AsNoTracking()
        .Include(x => x.History)
        .FirstOrDefaultAsync(x => x.UserId == userId);

    if (salary == null)
        return NotFound("برای این کارمند حقوقی ثبت نشده است.");

    var calendar = new PersianCalendar();
    var today = DateTime.Now;

    var currentYear = calendar.GetYear(today);
    var currentMonth = calendar.GetMonth(today);

    var historySalary = salary.History
        .Where(x =>
            IsEffective(
                x.EffectiveYear,
                x.EffectiveMonth,
                currentYear,
                currentMonth
            )
        )
        .OrderByDescending(x => x.EffectiveYear)
        .ThenByDescending(x => x.EffectiveMonth)
        .FirstOrDefault();

    var currentSalaryIsEffective = IsEffective(
        salary.EffectiveYear,
        salary.EffectiveMonth,
        currentYear,
        currentMonth
    );

    var useCurrentSalary =
        currentSalaryIsEffective
        && (
            historySalary == null
            || salary.EffectiveYear > historySalary.EffectiveYear
            || (
                salary.EffectiveYear == historySalary.EffectiveYear
                && salary.EffectiveMonth >= historySalary.EffectiveMonth
            )
        );

    if (!useCurrentSalary && historySalary == null)
        return NotFound(
            "تا تاریخ امروز، حقوق مؤثری برای این کارمند ثبت نشده است."
        );

    var effectiveSalary = useCurrentSalary
        ? new
        {
            baseSalary = salary.BaseSalary,
            housingAllowance = salary.HousingAllowance,
            foodAllowance = salary.FoodAllowance,
            transportationAllowance = salary.TransportationAllowance,
            childAllowance = salary.ChildAllowance,
            seniorityAllowance = salary.SeniorityAllowance,

            latePerHour = salary.LatePerHour,
            leavePerDay = salary.LeavePerDay,
            absentPerDay = salary.AbsentPerDay,
            overtimePerHour = salary.OvertimePerHour,

            tax = salary.Tax,
            insurance = salary.Insurance,

            effectiveYear = salary.EffectiveYear,
            effectiveMonth = salary.EffectiveMonth,

            source = "Current"
        }
        : new
        {
            baseSalary = historySalary!.BaseSalary,
            housingAllowance = historySalary.HousingAllowance,
            foodAllowance = historySalary.FoodAllowance,
            transportationAllowance = historySalary.TransportationAllowance,
            childAllowance = historySalary.ChildAllowance,
            seniorityAllowance = historySalary.SeniorityAllowance,

            latePerHour = historySalary.LatePerHour,
            leavePerDay = historySalary.LeavePerDay,
            absentPerDay = historySalary.AbsentPerDay,
            overtimePerHour = historySalary.OvertimePerHour,

            tax = historySalary.Tax,
            insurance = historySalary.Insurance,

            effectiveYear = historySalary.EffectiveYear,
            effectiveMonth = historySalary.EffectiveMonth,

            source = "History"
        };

    var payments = await _context.PayrollPayments
        .AsNoTracking()
        .Where(x => x.UserId == userId)
        .OrderByDescending(x => x.Year)
        .ThenByDescending(x => x.Month)
        .Select(x => new
        {
            id = x.Id,
            year = x.Year,
            month = x.Month,
            netSalary = x.NetSalary,
            totalAllowances = x.TotalAllowances,
            totalDeductions = x.TotalDeductions,
            status = x.Status,
            paidAt = x.PaidAt
        })
        .ToListAsync();

    var paidPayments = payments
        .Where(x => x.status == PayrollPaymentStatus.Paid)
        .ToList();

    return Ok(new
    {
        asOf = new
        {
            year = currentYear,
            month = currentMonth
        },

        currentSalary = new
        {
            effectiveSalary.baseSalary,
            effectiveSalary.housingAllowance,
            effectiveSalary.foodAllowance,
            effectiveSalary.transportationAllowance,
            effectiveSalary.childAllowance,
            effectiveSalary.seniorityAllowance,

            effectiveSalary.latePerHour,
            effectiveSalary.leavePerDay,
            effectiveSalary.absentPerDay,
            effectiveSalary.overtimePerHour,

            effectiveSalary.tax,
            effectiveSalary.insurance,

            effectiveYear = effectiveSalary.effectiveYear,
            effectiveMonth = effectiveSalary.effectiveMonth,
            effectiveSalary.source,

            totalAllowances =
                effectiveSalary.housingAllowance
                + effectiveSalary.foodAllowance
                + effectiveSalary.transportationAllowance
                + effectiveSalary.childAllowance
                + effectiveSalary.seniorityAllowance,

            grossSalary =
                effectiveSalary.baseSalary
                + effectiveSalary.housingAllowance
                + effectiveSalary.foodAllowance
                + effectiveSalary.transportationAllowance
                + effectiveSalary.childAllowance
                + effectiveSalary.seniorityAllowance,

            bankName = salary.BankName,
            accountHolderName = salary.AccountHolderName,
            accountNumber = salary.AccountNumber,
            cardNumber = salary.CardNumber,
            shebaNumber = salary.ShebaNumber
        },

        paymentSummary = new
        {
            paidCount = paidPayments.Count,

            paidAmount = paidPayments.Sum(
                x => x.netSalary
            ),

            totalAllowances = paidPayments.Sum(
                x => x.totalAllowances
            ),

            totalDeductions = paidPayments.Sum(
                x => x.totalDeductions
            ),

            pendingCount = payments.Count(
                x => x.status == PayrollPaymentStatus.Pending
            ),

            cancelledCount = payments.Count(
                x => x.status == PayrollPaymentStatus.Cancelled
            )
        },

        paidPayments,

        salaryHistory = salary.History
            .Select(x => new
            {
                id = x.Id,

                baseSalary = x.BaseSalary,
                housingAllowance = x.HousingAllowance,
                foodAllowance = x.FoodAllowance,
                transportationAllowance = x.TransportationAllowance,
                childAllowance = x.ChildAllowance,
                seniorityAllowance = x.SeniorityAllowance,

                latePerHour = x.LatePerHour,
                leavePerDay = x.LeavePerDay,
                absentPerDay = x.AbsentPerDay,
                overtimePerHour = x.OvertimePerHour,

                tax = x.Tax,
                insurance = x.Insurance,

                effectiveYear = x.EffectiveYear,
                effectiveMonth = x.EffectiveMonth,

                changeReason = x.ChangeReason,
                createdAt = x.CreatedAt,

                recordType = "History"
            })
            .Concat(new[]
            {
                new
                {
                    id = salary.Id,

                    baseSalary = salary.BaseSalary,
                    housingAllowance = salary.HousingAllowance,
                    foodAllowance = salary.FoodAllowance,
                    transportationAllowance = salary.TransportationAllowance,
                    childAllowance = salary.ChildAllowance,
                    seniorityAllowance = salary.SeniorityAllowance,

                    latePerHour = salary.LatePerHour,
                    leavePerDay = salary.LeavePerDay,
                    absentPerDay = salary.AbsentPerDay,
                    overtimePerHour = salary.OvertimePerHour,

                    tax = salary.Tax,
                    insurance = salary.Insurance,

                    effectiveYear = salary.EffectiveYear,
                    effectiveMonth = salary.EffectiveMonth,

                    changeReason = (string?)null,

                    createdAt = salary.UpdatedAt
                        ?? salary.CreatedAt,

                    recordType = "Current"
                }
            })
            .OrderByDescending(x => x.effectiveYear)
            .ThenByDescending(x => x.effectiveMonth)
    });
}
    private static bool IsEffective(int effectiveYear, int effectiveMonth, int year, int month)
    {
        return effectiveYear < year || (effectiveYear == year && effectiveMonth <= month);
    }
}
