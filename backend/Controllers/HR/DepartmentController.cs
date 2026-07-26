using HrSaaS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class DepartmentCreateDTO
{
    public string Name { get; set; } = "";
}

[ApiController]
[Route("api/departments")]
public class DepartmentsController : ControllerBase
{
    private readonly HRSaaSDbContext _db;

    public DepartmentsController(HRSaaSDbContext db)
    {
        _db = db;
    }

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

    [HttpPost]
    public async Task<IActionResult> Create(DepartmentCreateDTO dto)
    {
        var department = new Departments { Name = dto.Name };
        _db.Departments.Add(department);
        await _db.SaveChangesAsync();

        return Ok(department);
    }

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
