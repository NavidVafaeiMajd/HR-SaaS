using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class DepartmentCreateDTO
{
    public string Name { get; set; } = "";
}

[ApiController]
[Route("api/departments")]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly HRSaaSDbContext _db;

    public DepartmentsController(HRSaaSDbContext db)
    {
        _db = db;
    }

    [Permission(Permission.Department_view)]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _db.Departments.ToListAsync();

        if (departments == null || departments.Count == 0)
        {
            return NotFound("No departments found.");
        }

        return Ok(departments);
    }

    [Permission(Permission.Department_post)]
    [HttpPost]
    public async Task<IActionResult> Create(DepartmentCreateDTO dto)
    {
        var department = new Departments { Name = dto.Name };
        _db.Departments.Add(department);
        await _db.SaveChangesAsync();

        return Ok(department);
    }

    [Permission(Permission.Department_delete)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var department = await _db.Departments.FindAsync(id);
        if (department == null)
        {
            return NotFound();
        }

        _db.Departments.Remove(department);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [Permission(Permission.Department_edit)]
    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, DepartmentCreateDTO dto)
    {
        var department = _db.Departments.Find(id);
        if (department == null)
        {
            return NotFound();
        }
        department.Name = dto.Name;
        await _db.SaveChangesAsync();

        return Ok(department);
    }
}
