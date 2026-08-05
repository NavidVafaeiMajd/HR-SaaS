public class LeaveRequest
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = null!;

    public Guid LeaveTypeId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public decimal TotalDays { get; set; }

    public string? Description { get; set; }

    public string? Attachment { get; set; }

    public LeaveStatus Status { get; set; } = LeaveStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public Users User { get; set; } = null!;

    public LeaveType LeaveType { get; set; } = null!;

    public ICollection<LeaveApproval> Approvals { get; set; } = [];
}