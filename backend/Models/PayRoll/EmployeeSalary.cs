public class EmployeeSalary : IAuditable
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public decimal BaseSalary { get; set; }

    public decimal HousingAllowance { get; set; }
    public decimal FoodAllowance { get; set; }
    public decimal TransportationAllowance { get; set; }
    public decimal ChildAllowance { get; set; }
    public decimal SeniorityAllowance { get; set; }

    public decimal LatePerHour { get; set; }
    public decimal LeavePerDay { get; set; }
    public decimal AbsentPerDay { get; set; }
    public decimal OvertimePerHour { get; set; }


    public decimal Tax { get; set; }
    public decimal Insurance { get; set; }


    public int EffectiveYear { get; set; }
    public int EffectiveMonth { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public ICollection<EmployeeSalaryHistory> History { get; set; } = null!;

    public Users User { get; set; } = null!;
}