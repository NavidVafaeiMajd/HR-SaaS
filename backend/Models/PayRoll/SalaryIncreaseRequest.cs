public enum SalaryIncreaseRequestStatus
{
    Pending,
    Approved,
    Rejected,
    Canceled
}
public class SalaryIncreaseRequest : IAuditable
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public Users User { get; set; } = null!;

    public decimal CurrentBaseSalary { get; set; }

    public decimal RequestedBaseSalary { get; set; }

    public decimal IncreaseAmount { get; set; }
    public decimal IncreasePercentage { get; set; }

    public int EffectiveYear { get; set; }
    public int EffectiveMonth { get; set; }

    public string? Reason { get; set; }

    public SalaryIncreaseRequestStatus Status { get; set; }
        = SalaryIncreaseRequestStatus.Pending;

    public string? ApprovedById { get; set; }
    public Users? ApprovedBy { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public string? RejectionReason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}