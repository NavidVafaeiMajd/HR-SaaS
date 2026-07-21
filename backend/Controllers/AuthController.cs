using HrSaaS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HrSaaS.Controllers;

public class LoginRequest
{
    public string UserName { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    public string CurrentPassword {get;set;}="";
    public string NewPassword {get;set;}="";
}

public class MeResponse
{
    public string Id { get; set; } = default!;

    public string Email { get; set; } = default!;

    public string UserName { get; set; } = default!;

    public IList<string> Roles { get; set; } = [];
}

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<Users> _signInManager;
    private readonly UserManager<Users> _userManager;

    public AuthController(SignInManager<Users> signInManager, UserManager<Users> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.FindByNameAsync(request.UserName);

if (user is null)
    return Unauthorized();


        var result = await _signInManager.PasswordSignInAsync(
            request.UserName,
            request.Password,
            isPersistent: true,
            lockoutOnFailure: true
        );

        if (!result.Succeeded)
            return Unauthorized("Invalid username or password.");

        return Ok(user);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();

        return Ok();
    }


    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<MeResponse>> Me()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(
            new MeResponse
            {
                Id = user.Id,
                Email = user.Email!,
                UserName = user.UserName!,
                Roles = roles,
            }
        );
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(
        ChangePasswordRequest request)
    {

        var user =
            await _userManager.GetUserAsync(User);


        if (user == null)
            return Unauthorized();


        var result =
            await _userManager.ChangePasswordAsync(
                user,
                request.CurrentPassword,
                request.NewPassword);



        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok();
    }
}
