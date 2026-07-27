using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;

public enum DashboardType
{
    managment,
    employee
}
public enum Gender
{
    man,
    woman
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

}
