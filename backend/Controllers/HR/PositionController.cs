using HrSaaS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class PositionCreateDTO
{
    public string Name { get; set; } = "";
    public int DepartmentId { get; set; }

    public string Description { get; set; }
}

[ApiController]
[Route("api/designations")]
public class PositionsController : ControllerBase
{
    private readonly HRSaaSDbContext _db;

    public PositionsController(HRSaaSDbContext db)
    {
        _db = db;
    }

    [Permission(Permission.Position_view)]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var position = await _db.Positions.ToListAsync();

        if (position == null || position.Count == 0)
        {
            return NotFound("No position found.");
        }

        return Ok(position);
    }

    [Permission(Permission.Position_post)]
    [HttpPost]
    public async Task<IActionResult> Create(PositionCreateDTO dto)
    {
        var position = new Position
        {
            Name = dto.Name,
            DepartmentId = dto.DepartmentId,
            Description = dto.Description,
        };
        _db.Positions.Add(position);
        await _db.SaveChangesAsync();

        return Ok(position);
    }

    [Permission(Permission.Position_delete)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var position = await _db.Positions.FindAsync(id);
        if (position == null)
        {
            return NotFound();
        }

        _db.Positions.Remove(position);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("by-departments")]
    public async Task<IActionResult> GetPositions([FromQuery] List<int?> departmentIds)
    {
        if (departmentIds == null || departmentIds.Count == 0)
            return Ok(new List<object>());

        var positions = await _db
            .Positions.Where(x => departmentIds.Contains(x.DepartmentId))
            .Select(x => new { value = x.Id.ToString(), label = x.Name })
            .ToListAsync();

        return Ok(positions);
    }

    [Permission(Permission.Position_edit)]
    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, PositionCreateDTO dto)
    {
        var position = _db.Positions.Find(id);
        if (position == null)
        {
            return NotFound();
        }
        position.Name = dto.Name;
        position.DepartmentId = dto.DepartmentId;
        await _db.SaveChangesAsync();

        return Ok(position);
    }
}
