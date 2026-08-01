using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;

[ApiController]
[Route("notification")]
public class NotificationController : ControllerBase
{
    private readonly HRSaaSDbContext _db;
    private readonly UserManager<Users> _userManager;

    public NotificationController(HRSaaSDbContext db,UserManager<Users> userManager,)
    {
        _db = db;
        _userManager = userManager;

    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = _userManager.GetUserId(User);

        var Notification = _db.Notification.Where(x => x.UserId = userId).ToList();

        return Ok(Notification);
    }
}