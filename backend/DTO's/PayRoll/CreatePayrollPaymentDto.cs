public class CreatePayrollPaymentDto
{
    public string UserId { get; set; } = string.Empty;

    public int Year { get; set; }
    public int Month { get; set; }

    public decimal BaseSalary { get; set; }

    public decimal HousingAllowance { get; set; }
    public decimal FoodAllowance { get; set; }
    public decimal TransportationAllowance { get; set; }
    public decimal ChildAllowance { get; set; }
    public decimal SeniorityAllowance { get; set; }

    public int OvertimeMinutes { get; set; }
    public decimal OvertimeAmount { get; set; }

    public int LateMinutes { get; set; }
    public decimal LateDeduction { get; set; }

    public int AbsentDays { get; set; }
    public decimal AbsentDeduction { get; set; }

    public decimal LeaveDays { get; set; }
    public decimal LeaveDeduction { get; set; }

    public decimal Tax { get; set; }
    public decimal Insurance { get; set; }

    public decimal TotalAllowances { get; set; }
    public decimal TotalDeductions { get; set; }

    public decimal GrossSalary { get; set; }
    public decimal NetSalary { get; set; }
}