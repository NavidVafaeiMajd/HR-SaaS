namespace HrSaaS.Models;

public class RolePermission : IAuditable
{
    public string RoleId { get; set; }

    public Permission Permission { get; set; }

    public Role Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
