using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;

public class NotificationResponse
{
    public List<Notification> Items { get; set; } = [];

    public int Count { get; set; }

    public int UnreadCount { get; set; }
}

[ApiController]
[Route("api/notification")]
public class NotificationController : ControllerBase
{
    private readonly HRSaaSDbContext _db;
    private readonly UserManager<Users> _userManager;

    public NotificationController(HRSaaSDbContext db, UserManager<Users> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = _userManager.GetUserId(User);

        var notifications = await _db
            .Notification.Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(
            new NotificationResponse
            {
                Items = notifications,
                Count = notifications.Count,
                UnreadCount = notifications.Count(x => !x.IsRead),
            }
        );
    }

    [Authorize]
    [HttpPut("{id}/read")]
    public async Task<IActionResult> Read(Guid id)
    {
        var userId = _userManager.GetUserId(User);

        var notification = await _db.Notification.FirstOrDefaultAsync(x =>
            x.Id == id && x.UserId == userId
        );

        if (notification is null)
            return NotFound();

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
        }

        return NoContent();
    }

    [Authorize]
    [HttpPut("read-all")]
    public async Task<IActionResult> ReadAll()
    {
        var userId = _userManager.GetUserId(User);

        var notifications = await _db
            .Notification.Where(x => x.UserId == userId && !x.IsRead)
            .ToListAsync();

        if (notifications.Count == 0)
            return NoContent();

        var now = DateTime.UtcNow;

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = now;
        }

        await _db.SaveChangesAsync();

        return NoContent();
    }
}
