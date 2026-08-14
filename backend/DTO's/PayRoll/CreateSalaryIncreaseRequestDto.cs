public class CreateSalaryIncreaseRequestDto
{
    public decimal RequestedBaseSalary { get; set; }
    public int EffectiveYear { get; set; }
    public int EffectiveMonth { get; set; }
    public string? Reason { get; set; }
}
