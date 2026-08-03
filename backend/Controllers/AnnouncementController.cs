using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;

public class UpdateAnnouncementDto
{
    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public List<string> DepartmentIds { get; set; } = [];

    public List<string> PositionIds { get; set; } = [];

    public List<string> UserIds { get; set; } = [];
}

public class CreateAnnouncementDto
{
    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public List<int> DepartmentIds { get; set; } = [];

    public List<int> PositionIds { get; set; } = [];

    public List<string> UserIds { get; set; } = [];
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

[ApiController]
[Route("api/hr-news")]
public class AnnouncementController : ControllerBase
{
    private readonly HRSaaSDbContext _db;
    private readonly UserManager<Users> _userManager;
    private readonly IEventPublisher _publisher;

    public AnnouncementController(
        HRSaaSDbContext db,
        UserManager<Users> userManager,
        IEventPublisher publisher
    )
    {
        _db = db;
        _userManager = userManager;
        _publisher = publisher;
    }

    [Authorize]
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
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.Content,
                    x.CreatedAt,
                    x.StartDate,
                    x.EndDate,
                    Departments = x.Departments.Select(d => new
                    {
                        value = d.DepartmentId.ToString(),
                        label = d.Department.Name
                    }),

                    Positions = x.Positions.Select(p => new
                    {
                        value = p.PositionId.ToString(),
                        label = p.Position.Name
                    }),

                    Users = x.Users.Select(u => new
                    {
                        value = u.UserId,
                        label = _db.Users
                            .Where(user => user.Id == u.UserId)
                            .Select(user => user.FirstName + " " + user.LastName)
                            .FirstOrDefault()
                    }),
                    CreatedBy = _db
                        .Users.Where(u => u.Id == x.CreatedBy)
                        .Select(u => new
                        {
                            u.Id,
                            u.FirstName,
                            u.LastName,
                        })
                        .FirstOrDefault(),
                })
                .ToListAsync();

            return Ok(announcements);
        }

        var announcementsForUser = await _db
            .Announcement.Include(x => x.Users)
            .Where(x => x.Users.Any(u => u.UserId == user.Id))
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Content,
                x.CreatedAt,
                x.StartDate,
                x.EndDate,
                CreatedBy = _db
                    .Users.Where(u => u.Id == x.CreatedBy)
                    .Select(u => new
                    {
                        u.Id,
                        u.FirstName,
                        u.LastName,
                    })
                    .FirstOrDefault(),
            })
            .ToListAsync();

        return Ok(announcementsForUser);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateAnnouncementDto dto)
    {
        var announcement = await _db
            .Announcement
            .Include(x => x.Departments)
            .Include(x => x.Positions)
            .Include(x => x.Users)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (announcement is null)
            return NotFound();

        announcement.Title = dto.Title;
        announcement.Content = dto.Content;
        announcement.StartDate = dto.StartDate;
        announcement.EndDate = dto.EndDate;

        announcement.Departments.Clear();
        announcement.Positions.Clear();
        announcement.Users.Clear();

        announcement.Departments = dto.DepartmentIds
            .Select(x => new AnnouncementDepartment
            {
                Id = Guid.NewGuid(),
                AnnouncementId = announcement.Id,
                DepartmentId = int.Parse(x)
            })
            .ToList();

        announcement.Positions = dto.PositionIds
            .Select(x => new AnnouncementPosition
            {
                Id = Guid.NewGuid(),
                AnnouncementId = announcement.Id,
                PositionId = int.Parse(x)
            })
            .ToList();

        announcement.Users = dto.UserIds
            .Select(x => new AnnouncementUser
            {
                Id = Guid.NewGuid(),
                AnnouncementId = announcement.Id,
                UserId = x
            })
            .ToList();

        await _db.SaveChangesAsync();

        return Ok();
    }

    [Authorize]
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
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
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

        await _publisher.PublishAsync(
            new AnnouncementRequestedEvent(
                announcement.Users.Select(u => u.UserId).ToArray(),
                announcement.Id,
                $"{user.FirstName} {user.LastName}"
            )
        );

        return Ok(announcement.Id);
    }
}
