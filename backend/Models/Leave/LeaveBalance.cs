public class LeaveBalance
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = null!;

    public Guid LeaveTypeId { get; set; }

    public int Year { get; set; }

    public decimal TotalDays { get; set; }

    public decimal UsedDays { get; set; }

    public decimal RemainingDays { get; set; }

    public Users User { get; set; } = null!;

    public LeaveType LeaveType { get; set; } = null!;
}