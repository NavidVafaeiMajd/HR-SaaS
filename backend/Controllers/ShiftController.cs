using HrSaaS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class CreateShiftDto
{
    public string Name { get; set; } = null!;

    public ICollection<CreateShiftTimeDto> ShiftTimes { get; set; } = [];
}

public class CreateShiftTimeDto
{
    public WeekDay DayOfWeek { get; set; }

    public string StartTime { get; set; }

    public string EndTime { get; set; }
}

[ApiController]
[Route("api/shifts")]
public class ShiftController : ControllerBase
{
    private readonly HRSaaSDbContext _db;

    public ShiftController(HRSaaSDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var shifts = await _db.Shifts.Include(x => x.ShiftTimes).ToListAsync();

        if (shifts == null)
            NotFound();

        return Ok(shifts);
    }

    [HttpPost]
    public async Task<IActionResult> AddShift(CreateShiftDto dto)
    {
        var shift = new Shift
        {
            Name = dto.Name,
            ShiftTimes = dto
                .ShiftTimes.Select(x => new ShiftTime
                {
                    DayOfWeek = x.DayOfWeek,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                })
                .ToList(),
        };

        _db.Shifts.Add(shift);

        await _db.SaveChangesAsync();

        return Created("", shift);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> EditShift(CreateShiftDto dto, int id)
    {
        var shift = await _db
            .Shifts.Include(x => x.ShiftTimes)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (shift == null)
        {
            NotFound();
        }

        shift.Name = dto.Name;

        _db.ShiftsTime.RemoveRange(shift.ShiftTimes);

        shift.ShiftTimes = dto
            .ShiftTimes.Select(x => new ShiftTime
            {
                DayOfWeek = x.DayOfWeek,
                StartTime = x.StartTime,
                EndTime = x.EndTime,
            })
            .ToList();

        await _db.SaveChangesAsync();

        return Ok(shift);
    }

    [HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    var shift = await _db.Shifts
        .FirstOrDefaultAsync(x => x.Id == id);

    if (shift is null)
        return NotFound();

    _db.Shifts.Remove(shift);

    await _db.SaveChangesAsync();

    return NoContent();
}
}
