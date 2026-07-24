using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
public class RoleCreateDTO
{
    public string Name { get; set; } = "";

    public string Description { get; set; } = "";

    public List<Permission> Permissions { get; set; } = [];
}

[ApiController]
[Route("api/roles")]

public class RoleController : ControllerBase
{
    private readonly RoleManager<Role> _roleManager;
    private readonly HRSaaSDbContext _db;

    public RoleController(RoleManager<Role> roleManager, HRSaaSDbContext db)
    {
        _roleManager = roleManager;
        _db = db;
    }

        [HttpPost]
        public async Task<IResult> Create(RoleCreateDTO dto)
        {
            var role = new Role { Name = dto.Name , Description = dto.Description };

            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
                return Results.BadRequest(result.Errors);

            foreach (var permission in dto.Permissions)
            {
                _db.RolePermission.Add(
                    new RolePermission { RoleId = role.Id, Permission = permission , Role = role }
                );
            }

            await _db.SaveChangesAsync();
            return Results.Ok();
        }

    [HttpGet]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _roleManager.Roles
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Description,
                Permissions = _db.RolePermission
                .Where(rp => rp.RoleId == x.Id)
                .Select(rp => rp.Permission)
                .ToList()
            })
            .ToListAsync();

        return Ok(roles);
    }
}
