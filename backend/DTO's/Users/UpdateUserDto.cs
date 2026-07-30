public class UpdateUserDto
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
    public string PostalCode { get; set; } = "";
    public int DepartmentId { get; set; }
    public int PositionId { get; set; }
    public int ShiftId { get; set; }
    public string Role { get; set; } = "";
    public DashboardType dashboardType { get; set; } = DashboardType.employee;
    public Gender gender { get; set; }
    public int PersonnelCode { get; set; }
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? BirthDate { get; set; }
    public string? Address1 { get; set; } = null!;
    public string? Address2 { get; set; } = null!;
    public string? Religion { get; set; } = null!;
    public string? bloodGroup { get; set; } = null!;
    public string? nationality { get; set; } = null!;
    public string? citizenship { get; set; } = null!;
    public string? maritalStatus { get; set; } = null!;
    public string? city { get; set; } = null!;
    public string? province { get; set; } = null!;
}
