using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class UpdateUserDto
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
    public int DepartmentId { get; set; }
    public int PositionId { get; set; }
    public int ShiftId { get; set; }
    public string Role { get; set; } = "";
    public DashboardType dashboardType { get; set; } = DashboardType.employee;
    public Gender gender { get; set; }
    public int PersonnelCode { get; set; }
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? BirthDate { get; set; }
    public string? Address1 { get; set; } = null!;
    public string? Address2 { get; set; } = null!;
    public string? Religion { get; set; } = null!;
    public string? bloodGroup { get; set; } = null!;
    public string? nationality { get; set; } = null!;
    public string? citizenship { get; set; } = null!;
    public string? maritalStatus { get; set; } = null!;
    public string? city { get; set; } = null!;
    public string? province { get; set; } = null!;
}

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
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
}

public class SocialMediaDto
{
    public string? Instagram { set; get; } = null!;
    public string? Twitter { set; get; } = null!;
    public string? Linkedin { set; get; } = null!;
    public string? Email { set; get; } = null!;
}

[ApiController]
[Route("api/employees")]
public class UserController : ControllerBase
{
    private readonly UserManager<Users> _userManager;
    private readonly HRSaaSDbContext _db;

    public UserController(UserManager<Users> userManager, HRSaaSDbContext db)
    {
        _userManager = userManager;
        _db = db;
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
                x.Position,
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound();

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Edit(string id, UpdateUserDto dto)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound();

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.PersonnelCode = dto.PersonnelCode;
        user.PhoneNumber = dto.PhoneNumber;
        user.gender = dto.gender;
        user.DepartmentId = dto.DepartmentId;
        user.PositionId = dto.PositionId;
        user.ShiftId = dto.ShiftId;
        user.IsActive = dto.IsActive;
        user.dashboardType = dto.dashboardType;
        user.BirthDate = dto.BirthDate;
        user.Address1 = dto.Address1;
        user.Address2 = dto.Address2;
        user.Religion = dto.Religion;
        user.bloodGroup = dto.bloodGroup;
        user.nationality = dto.nationality;
        user.citizenship = dto.citizenship;
        user.maritalStatus = dto.maritalStatus;
        user.city = dto.city;
        user.province = dto.province;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // تغییر Role
        if (!string.IsNullOrWhiteSpace(dto.Role))
        {
            var roles = await _userManager.GetRolesAsync(user);

            await _userManager.RemoveFromRolesAsync(user, roles);

            await _userManager.AddToRoleAsync(user, dto.Role);
        }

        return Ok(user);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userManager
            .Users.Include(x => x.Department)
            .Include(x => x.Position)
            .Include(x=>x.SocialMedia)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateUserDto dto)
    {
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

    [HttpPost("social-media/{userId}")]
    public async Task<IActionResult> UpsertSocialMedia(string userId, SocialMediaDto dto)
    {

        var socialMedia = await _db.SocialMedia.FirstOrDefaultAsync();

        if (socialMedia == null)
        {
            socialMedia = new SocialMedia
            {
                Instagram = dto.Instagram,
                Linkedin = dto.Linkedin,
                Twitter = dto.Twitter,
                Email = dto.Email,
                UserId = userId,
            };
            _db.SocialMedia.Add(socialMedia);
        }

        socialMedia.Instagram = dto.Instagram;
        socialMedia.Linkedin = dto.Linkedin;
        socialMedia.Twitter = dto.Twitter;
        socialMedia.Email = dto.Email;
        socialMedia.UserId = userId;

        await _db.SaveChangesAsync();

        return Ok(socialMedia);
    }
}
