public class PayrollPayment : IAuditable
{
    public Guid Id { get; set; }

    // کارمند
    public string UserId { get; set; } = string.Empty;

    // ماه و سال حقوق
    public int Year { get; set; }
    public int Month { get; set; }

    // مبلغ نهایی قابل پرداخت
    public decimal NetSalary { get; set; }

    // اطلاعات حقوق در زمان پرداخت
    public decimal BaseSalary { get; set; }

    // مزایا
    public decimal HousingAllowance { get; set; }
    public decimal FoodAllowance { get; set; }
    public decimal TransportationAllowance { get; set; }
    public decimal ChildAllowance { get; set; }
    public decimal SeniorityAllowance { get; set; }

    public decimal OvertimeAmount { get; set; }
    public decimal LateDeduction { get; set; }
    public decimal LeaveDeduction { get; set; }
    public decimal AbsentDeduction { get; set; }

    public decimal Tax { get; set; }
    public decimal Insurance { get; set; }

    public decimal TotalAllowances { get; set; }

    public decimal TotalDeductions { get; set; }

    public DateTime? PaidAt { get; set; }

    public PayrollPaymentStatus Status { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Users User { get; set; } = null!;
}