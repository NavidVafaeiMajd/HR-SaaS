using System.Text.Json.Serialization;
using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;

public enum DashboardType
{
    manager,
    employee,
}

public enum Gender
{
    man,
    woman,
}

public class Users : IdentityUser
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string? Image { get; set; }
    public DashboardType dashboardType { get; set; } = DashboardType.employee;
    public Gender gender { get; set; }
    public int? ShiftId { get; set; }
    public Shift? Shift { get; set; }
    public int? DepartmentId { get; set; }
    public Departments? Department { get; set; }
    public int? PositionId { get; set; }
    public Position? Position { get; set; } = null!;
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
    public DateTime? BirthDate { get; set; }
    public EmergencyCall? EmergencyCall { get; set; }
    public Biography? Biography { get; set; }
    public SocialMedia? SocialMedia { get; set; }
}
