using HrSaaS.Models;
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

    var notifications = await _db.Notification
        .Where(x => x.UserId == userId)
        .OrderByDescending(x => x.CreatedAt)
        .ToListAsync();

    return Ok(new NotificationResponse
    {
        Items = notifications,
        Count = notifications.Count,
        UnreadCount = notifications.Count(x => !x.IsRead)
    });
}
}
