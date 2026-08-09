public class LeaveTypeListDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public bool IsPaid { get; set; }

    public decimal AnnualLimit { get; set; }
    public string Description { get; set; }

    public bool IsActive { get; set; }
}