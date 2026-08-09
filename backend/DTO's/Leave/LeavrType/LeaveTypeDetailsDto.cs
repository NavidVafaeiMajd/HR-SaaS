public class LeaveTypeDetailsDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }


    public bool IsPaid { get; set; }

    public decimal AnnualLimit { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}