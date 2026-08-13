public class IncreaseSalaryDto
{
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

    public DateOnly EffectiveFrom { get; set; }

    public string? ChangeReason { get; set; }
}