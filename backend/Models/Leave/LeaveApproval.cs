public class LeaveApproval
{
    public Guid Id { get; set; }

    public Guid LeaveRequestId { get; set; }

    public string ApproverId { get; set; } = null!;

    public LeaveStatus Status { get; set; }

    public string? Comment { get; set; }

    public DateTime? ActionAt { get; set; }

    public LeaveRequest LeaveRequest { get; set; } = null!;

    public Users Approver { get; set; } = null!;
}