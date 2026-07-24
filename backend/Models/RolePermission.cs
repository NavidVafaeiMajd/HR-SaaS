namespace HrSaaS.Models;
public class RolePermission
{

    public string RoleId { get; set; }

    public Permission Permission { get; set; }

        public Role Role { get; set; } = null!;


}