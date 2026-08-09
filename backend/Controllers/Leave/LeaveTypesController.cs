using HrSaaS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/leave-types")]
public class LeaveTypesController : ControllerBase
{
    private readonly HRSaaSDbContext _db;

    public LeaveTypesController(HRSaaSDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var leaveTypes = await _db
            .LeaveTypes.Select(x => new LeaveTypeListDto
            {
                Id = x.Id,
                Name = x.Name,
                IsPaid = x.IsPaid,
                AnnualLimit = x.AnnualLimit,
                IsActive = x.IsActive,
                Description = x.Description,
            })
            .OrderBy(x => x.Name)
            .ToListAsync();

        return Ok(leaveTypes);
    }

    [HttpPost]
    public async Task<IActionResult> Post(LeaveTypeCreateDto dto)
    {
        if (await _db.LeaveTypes.AnyAsync(x => x.Name == dto.Name))
            return BadRequest("A leave type with this name already exists.");

        var leaveType = new LeaveType
        {
            Name = dto.Name,
            Description = dto.Description,
            IsPaid = dto.IsPaid,
            AnnualLimit = dto.AnnualLimit,
            IsActive = dto.IsActive,
        };

        _db.LeaveTypes.Add(leaveType);

        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = leaveType.Id }, leaveType.Id);
    }

    [HttpGet("options")]
    public async Task<IActionResult> GetOptions()
    {
        var leaveTypes = await _db.LeaveTypes
            .Where(x => x.IsActive )
            .Select(x => new
            {
                value = x.Id.ToString(),
                label = x.Name
            })
            .OrderBy(x => x.label)
            .ToListAsync();

        return Ok(leaveTypes);
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Put(Guid id, LeaveTypeUpdateDto dto)
    {
        var leaveType = await _db.LeaveTypes.FindAsync(id);

        if (leaveType is null)
            return NotFound();

        if (await _db.LeaveTypes.AnyAsync(x => x.Id != id && x.Name == dto.Name))
            return BadRequest("A leave type with this name already exists.");

        leaveType.Name = dto.Name;
        leaveType.Description = dto.Description;
        leaveType.IsPaid = dto.IsPaid;
        leaveType.AnnualLimit = dto.AnnualLimit;
        leaveType.IsActive = dto.IsActive;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var leaveType = await _db.LeaveTypes.FindAsync(id);

        if (leaveType is null)
            return NotFound();

        var hasRequests = await _db.LeaveRequests.AnyAsync(x => x.LeaveTypeId == id);

        if (hasRequests)
        {
            leaveType.IsActive = false;

            await _db.SaveChangesAsync();

            return Conflict(
                new
                {
                    message = "این نوع مرخصی به دلیل داشتن درخواست‌های ثبت‌شده حذف نشد و غیرفعال شد.",
                }
            );
        }

        _db.LeaveTypes.Remove(leaveType);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}
