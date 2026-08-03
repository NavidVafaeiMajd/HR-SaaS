using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;

public class CreateAnnouncementDto
{
    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public List<int> DepartmentIds { get; set; } = [];

    public List<int> PositionIds { get; set; } = [];

    public List<string> UserIds { get; set; } = [];
}

[ApiController]
[Route("api/hr-news")]
public class AnnouncementController : ControllerBase
{
    private readonly HRSaaSDbContext _db;
    private readonly UserManager<Users> _userManager;

    public AnnouncementController(HRSaaSDbContext db, UserManager<Users> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [Permission(Permission.Users_post)]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);

        var permissions = await _db
            .RolePermission.Where(rp => roles.Contains(rp.Role.Name))
            .Select(rp => rp.Permission)
            .ToListAsync();

        if (roles.Contains("Admin") || permissions.Contains(Permission.Department_edit))
        {
            var announcements = await _db
                .Announcement.Include(x => x.Users)
                .Include(x => x.Departments)
                .Include(x => x.Positions)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(announcements);
        }

        var announcementsForUser = await _db
            .Announcement.Include(x => x.Users)
            .Where(x => x.Users.Any(u => u.UserId == user.Id))
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(announcementsForUser);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAnnouncementDto dto)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);

        var permissions = await _db
            .RolePermission.Where(x => roles.Contains(x.Role.Name))
            .Select(x => x.Permission)
            .ToListAsync();

        // if (!permissions.Contains(Permission.AnnouncementCreate))
        //     return Forbid();

        var announcement = new Announcement
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user.Id,
        };

        announcement.Departments = dto
            .DepartmentIds.Distinct()
            .Select(id => new AnnouncementDepartment { Id = Guid.NewGuid(), DepartmentId = id })
            .ToList();

        announcement.Positions = dto
            .PositionIds.Distinct()
            .Select(id => new AnnouncementPosition { Id = Guid.NewGuid(), PositionId = id })
            .ToList();

        announcement.Users = dto
            .UserIds.Distinct()
            .Select(id => new AnnouncementUser { Id = Guid.NewGuid(), UserId = id })
            .ToList();

        _db.Announcement.Add(announcement);

        await _db.SaveChangesAsync();

        return Ok(announcement.Id);
    }
}
