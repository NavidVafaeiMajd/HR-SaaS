
public class AccountResponse
{
    public string Id { get; set; } = "";

    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";

    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";

    public string? Image { get; set; }

    public DateTime? BirthDate { get; set; }
    public string? PhoneNumber { get; set; }

    public DepartmentDto? Department { get; set; }
    public PositionDto? Position { get; set; }
    public DashboardType dashboardType { get; set; } = DashboardType.employee;
    public Gender gender { get; set; }
    public int? ShiftId { get; set; }
    public Shift? Shift { get; set; }
    public int? DepartmentId { get; set; }
    public int? PositionId { get; set; }
    public int PersonnelCode { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Address1 { get; set; } = null!;
    public string? Address2 { get; set; } = null!;
    public string? Religion { get; set; } = null!;
    public string? bloodGroup { get; set; } = null!;
    public string? nationality { get; set; } = null!;
    public string? citizenship { get; set; } = null!;
    public string? maritalStatus { get; set; } = null!;
    public string? city { get; set; } = null!;
    public string? PostalCode { get; set; } = null!;
    public string? province { get; set; } = null!;
    public BiographyDto? Biography { get; set; }
    public SocialMediaDto? SocialMedia { get; set; }
    public EmergencyCallDTO? EmergencyCall { get; set; }
}
