public class CreateLeaveRequestDto
{
    public Guid LeaveTypeId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }
    public string UserId { get; set; } = null!;
        public string? Reason { get; set; }

}