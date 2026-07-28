using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/employees")]
public class UserController : ControllerBase
{
    private readonly UserManager<Users> _userManager;

    public UserController(UserManager<Users> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userManager
            .Users.Include(x => x.Position)
            .AsNoTracking()
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName,
                x.PositionId,
                x.PhoneNumber,
                x.gender,
                x.IsActive,
            })
            .ToListAsync();

        return Ok(users);
    }
}
