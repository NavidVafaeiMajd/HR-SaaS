public class UpdateLeaveRequestDto
{
    public Guid LeaveTypeId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string? Reason { get; set; }

    public string? Attachment { get; set; }
}