public class LeaveRequest :IAuditable
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = null!;

    public Guid LeaveTypeId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public decimal TotalDays { get; set; }

    public string? Description { get; set; }

    public string? Attachment { get; set; }

    public LeaveStatus Status { get; set; } = LeaveStatus.Pending;

    public string? ApprovedById { get; set; }

    public string? ApprovalComment { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public Users User { get; set; } = null!;

    public Users? ApprovedBy { get; set; }

    public LeaveType LeaveType { get; set; } = null!;
}