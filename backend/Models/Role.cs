using Microsoft.AspNetCore.Identity;
namespace HrSaaS.Models;

public class Role : IdentityRole
{
    public string Description { get; set; }
}