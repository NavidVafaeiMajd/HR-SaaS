
public class AccountResponse
{
    public string Id { get; set; } = "";

    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";

    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";

    public string? Image { get; set; }

    public DateOnly? BirthDate { get; set; }
    public string? PhoneNumber { get; set; }

    public DepartmentDto? Department { get; set; }
    public PositionDto? Position { get; set; }

    public BiographyDto? Biography { get; set; }
    public SocialMediaDto? SocialMedia { get; set; }
    public EmergencyCallDTO? EmergencyCall { get; set; }
}
