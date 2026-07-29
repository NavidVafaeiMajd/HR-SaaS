using System.Security.Claims;
using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

public class AppClaimsPrincipalFactory : UserClaimsPrincipalFactory<Users, Role>
{
    public AppClaimsPrincipalFactory(
        UserManager<Users> userManager,
        RoleManager<Role> roleManager,
        IOptions<IdentityOptions> optionsAccessor,
        HRSaaSDbContext db
    )
        : base(userManager, roleManager, optionsAccessor)
    {
        _db = db;
    }

    private readonly HRSaaSDbContext _db;

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(Users user)
    {
        var identity = await base.GenerateClaimsAsync(user);

        var roles = await UserManager.GetRolesAsync(user);

        var permissions = await _db
            .RolePermission.Where(rp => roles.Contains(rp.Role.Name))
            .Select(rp => rp.Permission)
            .Distinct()
            .ToListAsync();

        foreach (var permission in permissions)
        {
            identity.AddClaim(new Claim("permission", permission.ToString()));
        }
        return identity;
    }
}
