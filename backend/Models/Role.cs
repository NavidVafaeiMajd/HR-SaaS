using Microsoft.AspNetCore.Identity;
namespace HrSaaS.Models;

public class Role : IdentityRole , IAuditable
{
    public string Description { get; set; }

        public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}