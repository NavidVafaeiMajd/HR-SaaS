using System.Globalization;
using HrSaaS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/payroll-period")]
public class PayrollPeriodController : ControllerBase
{
    private readonly HRSaaSDbContext _context;

    public PayrollPeriodController(HRSaaSDbContext context)
    {
        _context = context;
    }

    // GET: api/payroll-period?year=1405&month=6
    [HttpGet]
    public async Task<IActionResult> GetPeriod([FromQuery] int year, [FromQuery] int month)
    {
        if (month < 1 || month > 12)
            return BadRequest("ماه باید بین 1 تا 12 باشد.");

        if (year <= 0)
            return BadRequest("سال نامعتبر است.");

        var persianCalendar = new PersianCalendar();

        DateTime monthStart = persianCalendar.ToDateTime(year, month, 1, 0, 0, 0, 0);

        DateTime monthEnd;

        if (month == 12)
        {
            monthEnd = persianCalendar.ToDateTime(year + 1, 1, 1, 0, 0, 0, 0);
        }
        else
        {
            monthEnd = persianCalendar.ToDateTime(year, month + 1, 1, 0, 0, 0, 0);
        }

        // 1. Get users whose salary has already been paid
        // -----------------------------------------

        var paidUserIds = await _context
            .PayrollPayments.AsNoTracking()
            .Where(x => x.Year == year && x.Month == month)
            .Select(x => x.UserId)
            .ToListAsync();

        var paidUsers = paidUserIds.ToHashSet();

        // -----------------------------------------
        // 2. Get all salaries
        // -----------------------------------------

        var salaries = await _context
            .EmployeeSalaries.AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.History)
            .ToListAsync();

        var result = new List<object>();

        // -----------------------------------------
        // 3. Process each employee
        // -----------------------------------------

        foreach (var salary in salaries)
        {
            // If the salary has already been paid for this month,
            // do not include the employee in the Period.
            if (paidUsers.Contains(salary.UserId))
                continue;

            // -----------------------------------------
            // 4. Find the effective Salary for this month
            // -----------------------------------------

            var historySalary = salary
                .History.Where(x =>
                    x.EffectiveYear < year || (x.EffectiveYear == year && x.EffectiveMonth <= month)
                )
                .OrderByDescending(x => x.EffectiveYear)
                .ThenByDescending(x => x.EffectiveMonth)
                .FirstOrDefault();

            var currentSalaryIsValid =
                salary.EffectiveYear < year
                || (salary.EffectiveYear == year && salary.EffectiveMonth <= month);

            EmployeeSalaryHistory? selectedHistory = historySalary;

            bool useCurrentSalary = false;

            if (currentSalaryIsValid)
            {
                var historyIsOlder =
                    selectedHistory == null
                    || salary.EffectiveYear > selectedHistory.EffectiveYear
                    || (
                        salary.EffectiveYear == selectedHistory.EffectiveYear
                        && salary.EffectiveMonth >= selectedHistory.EffectiveMonth
                    );

                if (historyIsOlder)
                {
                    useCurrentSalary = true;
                }
            }

            // -----------------------------------------
            // 5. Skip if no valid salary exists
            // -----------------------------------------

            if (!useCurrentSalary && selectedHistory == null)
                continue;

            // -----------------------------------------
            // 6. Get Salary values
            // -----------------------------------------

            decimal baseSalary;
            decimal housingAllowance;
            decimal foodAllowance;
            decimal transportationAllowance;
            decimal childAllowance;
            decimal seniorityAllowance;

            decimal latePerHour;
            decimal leavePerDay;
            decimal absentPerDay;
            decimal overtimePerHour;

            decimal tax;
            decimal insurance;

            int salaryYear;
            int salaryMonth;

            if (useCurrentSalary)
            {
                baseSalary = salary.BaseSalary;

                housingAllowance = salary.HousingAllowance;
                foodAllowance = salary.FoodAllowance;
                transportationAllowance = salary.TransportationAllowance;
                childAllowance = salary.ChildAllowance;
                seniorityAllowance = salary.SeniorityAllowance;

                latePerHour = salary.LatePerHour;
                leavePerDay = salary.LeavePerDay;
                absentPerDay = salary.AbsentPerDay;
                overtimePerHour = salary.OvertimePerHour;

                tax = salary.Tax;
                insurance = salary.Insurance;

                salaryYear = salary.EffectiveYear;
                salaryMonth = salary.EffectiveMonth;
            }
            else
            {
                baseSalary = selectedHistory!.BaseSalary;

                housingAllowance = selectedHistory.HousingAllowance;

                foodAllowance = selectedHistory.FoodAllowance;

                transportationAllowance = selectedHistory.TransportationAllowance;

                childAllowance = selectedHistory.ChildAllowance;

                seniorityAllowance = selectedHistory.SeniorityAllowance;

                latePerHour = selectedHistory.LatePerHour;

                leavePerDay = selectedHistory.LeavePerDay;

                absentPerDay = selectedHistory.AbsentPerDay;

                overtimePerHour = selectedHistory.OvertimePerHour;

                tax = selectedHistory.Tax;
                insurance = selectedHistory.Insurance;

                salaryYear = selectedHistory.EffectiveYear;

                salaryMonth = selectedHistory.EffectiveMonth;
            }

            // -----------------------------------------
            // 7. Get attendance records for the same month
            // -----------------------------------------

            var attendances = await _context
                .Attendances.AsNoTracking()
                .Where(x =>
                    x.UserId == salary.UserId
                    && x.Date >= DateOnly.FromDateTime(monthStart)
                    && x.Date < DateOnly.FromDateTime(monthEnd)
                )
                .ToListAsync();

            // -----------------------------------------
            // 8. Calculate late deductions
            // -----------------------------------------

            var totalLateMinutes = attendances.Sum(x => x.LateMinutes);

            var totalLateHours = totalLateMinutes / 60m;

            var lateDeduction = totalLateHours * latePerHour;

            // -----------------------------------------
            // 9. Calculate absence deductions
            // -----------------------------------------

            var absentDays = attendances.Count(x => x.Status == AttendanceStatus.Absent);

            var absentDeduction = absentDays * absentPerDay;

            // -----------------------------------------
            // 10. Calculate overtime
            // -----------------------------------------

            var totalOvertimeMinutes = attendances.Sum(x => x.OvertimeMinutes);

            var totalOvertimeHours = totalOvertimeMinutes / 60m;

            var overtimeAmount = totalOvertimeHours * overtimePerHour;

            // -----------------------------------------
            // 11. Calculate leave
            // -----------------------------------------

            var leaveStart = DateOnly.FromDateTime(monthStart);
            var leaveEnd = DateOnly.FromDateTime(monthEnd);

            var leaveDays = await _context
                .LeaveRequests.AsNoTracking()
                .Where(x =>
                    x.UserId == salary.UserId
                    && x.Status == LeaveStatus.Approved
                    && x.StartDate < leaveEnd
                    && x.EndDate >= leaveStart
                )
                .Select(x => new { x.StartDate, x.EndDate })
                .ToListAsync();

            decimal totalLeaveDays = 0;

            foreach (var leave in leaveDays)
            {
                var start = leave.StartDate < leaveStart ? leaveStart : leave.StartDate;

                var end = leave.EndDate >= leaveEnd ? leaveEnd.AddDays(-1) : leave.EndDate;

                if (end >= start)
                {
                    totalLeaveDays += end.DayNumber - start.DayNumber + 1;
                }
            }

            var leaveDeduction = totalLeaveDays * leavePerDay;

            // -----------------------------------------
            // 12. Calculate allowances
            // -----------------------------------------

            var totalAllowances =
                housingAllowance
                + foodAllowance
                + transportationAllowance
                + childAllowance
                + seniorityAllowance;

            // -----------------------------------------
            // 13. Calculate total attendance deductions
            // -----------------------------------------

            var attendanceDeductions = lateDeduction + leaveDeduction + absentDeduction;

            // -----------------------------------------
            // 14. Calculate total deductions
            // -----------------------------------------

            var totalDeductions = attendanceDeductions + tax + insurance;

            // -----------------------------------------
            // 15. Calculate gross salary
            // -----------------------------------------

            var grossSalary = baseSalary + totalAllowances + overtimeAmount;

            // -----------------------------------------
            // 16. Calculate net salary
            // -----------------------------------------

            var netSalary = grossSalary - totalDeductions;

            // -----------------------------------------
            // 17. Build response
            // -----------------------------------------

            result.Add(
                new
                {
                    userId = salary.UserId,

                    firstName = salary.User.FirstName,
                    lastName = salary.User.LastName,

                    personnelCode = salary.User.PersonnelCode,

                    year,
                    month,

                    // Salary
                    baseSalary,

                    housingAllowance,
                    foodAllowance,
                    transportationAllowance,
                    childAllowance,
                    seniorityAllowance,

                    totalAllowances,

                    // Attendance
                    overtimeMinutes = totalOvertimeMinutes,

                    overtimeHours = totalOvertimeHours,

                    overtimeAmount,

                    lateMinutes = totalLateMinutes,

                    lateHours = totalLateHours,

                    lateDeduction,

                    absentDays,

                    absentDeduction,

                    leaveDays = totalLeaveDays,

                    leaveDeduction,

                    // Deductions
                    tax,
                    insurance,

                    attendanceDeductions,

                    totalDeductions,

                    // Salary result
                    grossSalary,

                    netSalary,

                    // Salary history reference
                    salaryEffectiveYear = salaryYear,

                    salaryEffectiveMonth = salaryMonth,

                    status = "Unknown",
                }
            );
        }

        // -----------------------------------------
        // 18. Build response
        // -----------------------------------------

        return Ok(
            new
            {
                year,
                month,

                count = result.Count,

                items = result,
            }
        );
    }
}