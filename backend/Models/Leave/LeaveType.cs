public class LeaveType:IAuditable
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public bool IsPaid { get; set; }

    public bool RequireAttachment { get; set; }
    public decimal AnnualLimit { get; set; }

    public bool IsHourly { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { set; get; }

    public DateTime? UpdatedAt { set; get; }
    public ICollection<LeaveRequest> LeaveRequests { get; set; } = [];
    public ICollection<LeaveBalance> LeaveBalances { get; set; } = [];
}