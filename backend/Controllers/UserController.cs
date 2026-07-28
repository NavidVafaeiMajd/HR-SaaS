using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class CreateUserDto
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";

    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";

    public int DepartmentId { get; set; }
    public int PositionId { get; set; }
    public int ShiftId { get; set; }

    public string Role { get; set; } = "";
    public string? Image { get; set; }
    public DashboardType dashboardType { get; set; } = DashboardType.employee;
    public Gender gender { get; set; }
    public int PersonnelCode { get; set; }
    public string PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
}

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
                x.UserName,
                x.FirstName,
                x.LastName,
                x.PositionId,
                x.PhoneNumber,
                x.gender,
                x.IsActive,
x.Position
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateUserDto dto)
    {
        // بررسی تکراری نبودن نام کاربری
        var exists = await _userManager.FindByNameAsync(dto.UserName);

        if (exists != null)
            return BadRequest(new { message = "Username already exists." });

        var user = new Users
        {
            PersonnelCode = dto.PersonnelCode,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            UserName = dto.UserName,
            Email = dto.Email,
            dashboardType = dto.dashboardType,
            gender = dto.gender,
            PhoneNumber = dto.PhoneNumber,
            Image = dto.Image,

            DepartmentId = dto.DepartmentId,
            PositionId = dto.PositionId,
            ShiftId = dto.ShiftId,

            IsActive = true,
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        if (!string.IsNullOrWhiteSpace(dto.Role))
        {
            await _userManager.AddToRoleAsync(user, dto.Role);
        }

        return Created(
            "",
            new
            {
                user.Id,
                user.FirstName,
                user.LastName,
            }
        );
    }
}
