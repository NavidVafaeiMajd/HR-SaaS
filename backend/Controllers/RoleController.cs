using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class RoleCreateDTO
{
    public string Name { get; set; } = "";

    public string Description { get; set; } = "";

    public List<Permission> Permissions { get; set; } = [];
}

//api/roles
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

    [Authorize]
        [Permission(Permission.Role_view)]
    [HttpPost]
    public async Task<IResult> Create(RoleCreateDTO dto)
    {
        var role = new Role { Name = dto.Name, Description = dto.Description };

        var result = await _roleManager.CreateAsync(role);

        if (!result.Succeeded)
            return Results.BadRequest(result.Errors);

        foreach (var permission in dto.Permissions)
        {
            _db.RolePermission.Add(
                new RolePermission
                {
                    RoleId = role.Id,
                    Permission = permission,
                    Role = role,
                }
            );
        }

        await _db.SaveChangesAsync();
        return Results.Ok();
    }

    [Authorize]
        [Permission(Permission.Role_delete)]

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var role = await _roleManager.FindByIdAsync(id);

        if (role is null)
            return NotFound();

        // foreach (var permission in _db.RolePermission.Where(rp => rp.RoleId == id))
        // {
        //     _db.RolePermission.Remove(permission);
        // }
        //or
        var permissions = _db.RolePermission.Where(rp => rp.RoleId == id);

        _db.RolePermission.RemoveRange(permissions);

        await _db.SaveChangesAsync();

        var result = await _roleManager.DeleteAsync(role);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return NoContent();
    }

    [Authorize]
        [Permission(Permission.Role_edit)]
    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(RoleCreateDTO dto, string id)
    {
        var role = await _roleManager.FindByIdAsync(id);

        if (role is null)
            return NotFound();

        role.Name = dto.Name;
        role.Description = dto.Description;

        await _roleManager.UpdateAsync(role);

        // foreach (var permission in _db.RolePermission.Where(rp => rp.RoleId == id))
        // {
        //     _db.RolePermission.Remove(permission);
        // }
        //or
        // var permissions = _db.RolePermission.Where(rp => rp.RoleId == id);

        // _db.RolePermission.RemoveRange(permissions);
        //or
        await _db.RolePermission.Where(rp => rp.RoleId == id).ExecuteDeleteAsync();

        foreach (var permission in dto.Permissions)
        {
            _db.RolePermission.Add(
                new RolePermission
                {
                    RoleId = role.Id,
                    Permission = permission,
                    Role = role,
                }
            );
        }
        await _db.SaveChangesAsync();

        return Ok(role);
    }

    [Authorize]
    [Permission(Permission.Role_view)]
    [HttpGet]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _roleManager
            .Roles.Select(x => new
            {
                x.Id,
                x.Name,
                x.Description,
                Permissions = _db
                    .RolePermission.Where(rp => rp.RoleId == x.Id)
                    .Select(rp => rp.Permission)
                    .ToList(),
            }).Where(r => r.Name != "Admin")
            .ToListAsync();

        return Ok(roles);
    }
}
