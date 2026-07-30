using System.Security.Claims;
using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/account")]
public class AccountController : ControllerBase
{
    private readonly UserManager<Users> _userManager;
    private readonly HRSaaSDbContext _db;
    private readonly RoleManager<Role> _roleManager;
    private readonly IImageService _imageService;

    public AccountController(
        UserManager<Users> userManager,
        IImageService imageService,
        RoleManager<Role> roleManager,
        HRSaaSDbContext db
    )
    {
        _userManager = userManager;
        _imageService = imageService;
        _roleManager = roleManager;
        _db = db;
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
        _imageService.Delete(user.Image);

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
        user.Email = dto.Email;
        user.PostalCode = dto.PostalCode;

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

    [HttpGet]
    public async Task<ActionResult<AccountResponse>> GetAccount()
    {
        var userId = _userManager.GetUserId(User);

        if (userId is null)
            return Unauthorized();

        var account = await _userManager
            .Users.AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(x => new AccountResponse
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                UserName = x.UserName!,
                Email = x.Email!,
                PhoneNumber = x.PhoneNumber,
                Image = x.Image,
                Address1 = x.Address1,
                Address2 = x.Address2,
                BirthDate = x.BirthDate,
                bloodGroup = x.bloodGroup,
                citizenship = x.citizenship,
                city = x.city,
                dashboardType = x.dashboardType,
                DepartmentId = x.DepartmentId,
                gender = x.gender,
                IsActive = x.IsActive,
                maritalStatus = x.maritalStatus,
                nationality = x.nationality,
                PersonnelCode = x.PersonnelCode,
                PositionId = x.PositionId,
                PostalCode = x.PostalCode,
                province = x.province,
                Religion = x.Religion,
                ShiftId = x.ShiftId,
                Biography =
                    x.Biography == null
                        ? null
                        : new BiographyDto
                        {
                            Bio = x.Biography.Bio,
                            WorkExperience = x.Biography.WorkExperience,
                        },

                SocialMedia =
                    x.SocialMedia == null
                        ? null
                        : new SocialMediaDto
                        {
                            Linkedin = x.SocialMedia.Linkedin,
                            Email = x.SocialMedia.Email,
                            Instagram = x.SocialMedia.Instagram,
                            Twitter = x.SocialMedia.Twitter,
                        },

                EmergencyCall =
                    x.EmergencyCall == null
                        ? null
                        : new EmergencyCallDTO
                        {
                            EmergencyName = x.EmergencyCall.EmergencyName,
                            EmergencyPhone = x.EmergencyCall.EmergencyPhone,
                        },
            })
            .FirstOrDefaultAsync();

        if (account == null)
            return NotFound();

        return Ok(account);
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
            Image = await _imageService.SaveAsync(dto.Image),

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

    [HttpPost("biography")]
    public async Task<IActionResult> UpsertBiography(BiographyDto dto)
    {
        var biography = await _db.Biography.FirstOrDefaultAsync();
        var userId = _userManager.GetUserId(User);

        if (biography == null)
        {
            biography = new Biography
            {
                Bio = dto.Bio,
                WorkExperience = dto.WorkExperience,
                UserId = userId,
            };
            _db.Biography.Add(biography);
        }

        biography.Bio = dto.Bio;
        biography.WorkExperience = dto.WorkExperience;
        biography.UserId = userId;

        await _db.SaveChangesAsync();

        return Ok(biography);
    }

    [HttpPost("image")]
    public async Task<IActionResult> UpdateImage([FromForm] UpdateImageUserDto dto)
    {
        if (dto.Image == null)
            return BadRequest("Image is required."); 

        var user = await _userManager.GetUserAsync(User);

        if (user == null)
            return NotFound();

        user.Image = await _imageService.ReplaceAsync(user.Image, dto.Image);

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new { image = user.Image });
    }

    [HttpPatch("{reset-password")]
    public async Task<IActionResult> ResetPassword(string id, [FromBody] ResetPasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound();

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { Message = "Password reset successfully." });
    }

    [HttpDelete("image")]
    public async Task<IActionResult> DeleteImage()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
            return NotFound();

        _imageService.Delete(user.Image);
        user.Image = null;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return NoContent();
    }

    [HttpPost("social-media")]
    public async Task<IActionResult> UpsertSocialMedia(SocialMediaDto dto)
    {
        var socialMedia = await _db.SocialMedia.FirstOrDefaultAsync();
        var userId = _userManager.GetUserId(User);

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

    [HttpPost("emergencyCall")]
    public async Task<IActionResult> UpsertEmergencyCall( EmergencyCallDTO dto)
    {
        var emergencyCall = await _db.EmergencyCall.FirstOrDefaultAsync();
        var userId = _userManager.GetUserId(User);

        if (emergencyCall == null)
        {
            emergencyCall = new EmergencyCall
            {
                EmergencyName = dto.EmergencyName,
                EmergencyPhone = dto.EmergencyPhone,

                UserId = userId,
            };
            _db.EmergencyCall.Add(emergencyCall);
        }

        emergencyCall.EmergencyName = dto.EmergencyName;
        emergencyCall.EmergencyPhone = dto.EmergencyPhone;
        emergencyCall.UserId = userId;

        await _db.SaveChangesAsync();

        return Ok(emergencyCall);
    }
}
