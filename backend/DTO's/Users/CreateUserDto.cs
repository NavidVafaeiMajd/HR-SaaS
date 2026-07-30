
public class CreateUserDto
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";

    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";

    public int DepartmentId { get; set; }
    public int PositionId { get; set; }
    public int ShiftId { get; set; }

    public string Role { get; set; } = "";
    public IFormFile? Image { get; set; }
    public DashboardType dashboardType { get; set; } = DashboardType.employee;
    public Gender gender { get; set; }
    public int PersonnelCode { get; set; }
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
}
