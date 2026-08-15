using HrSaaS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/company")]
public class CompanyController : ControllerBase
{
    private readonly HRSaaSDbContext _context;
    private readonly IImageService _imageService;
    private readonly UserManager<Users> _userManager;

    public CompanyController(HRSaaSDbContext context, IImageService imageService, UserManager<Users> userManager)
    {
        _context = context;
        _imageService = imageService;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetCompany()
    {
        var company = await _context.Company
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (company == null)
            return NotFound("اطلاعات شرکت یافت نشد.");

        return Ok(company);
    }

    [HttpPatch]
    public async Task<IActionResult> UpdateCompany([FromBody] Company company)
    {
        var existingCompany = await _context.Company.FirstOrDefaultAsync();

        if (existingCompany == null)
        {
            _context.Company.Add(company);
            await _context.SaveChangesAsync();
            return Ok(company);
        }

        // Update the properties of the existing company with the new values
        existingCompany.Name = company.Name;
        existingCompany.LegalName = company.LegalName;
        existingCompany.NationalId = company.NationalId;
        existingCompany.RegistrationNumber = company.RegistrationNumber;
        existingCompany.EconomicCode = company.EconomicCode;
        existingCompany.CompanyType = company.CompanyType;
        existingCompany.FoundedDate = company.FoundedDate;
        existingCompany.Logo = company.Logo;
        existingCompany.Description = company.Description;
        existingCompany.Phone = company.Phone;
        existingCompany.Mobile = company.Mobile;
        existingCompany.Email = company.Email;
        existingCompany.Website = company.Website;
        existingCompany.Fax = company.Fax;
        existingCompany.Country = company.Country;
        existingCompany.Province = company.Province;
        existingCompany.City = company.City;

        await _context.SaveChangesAsync();

        return Ok(existingCompany);
    }

    [Permission(Permission.Users_edit)]
    [HttpPost("logo")]
    public async Task<IActionResult> UpdateLogo(
[FromForm] UpdateImageCompanyDto dto)
    {
        if (dto.Logo == null)
            return BadRequest("Logo is required.");

        var company = await _context.Company.FirstOrDefaultAsync();

        if (company == null)
            return NotFound("Company not found.");

        company.Logo = await _imageService.ReplaceAsync(
            company.Logo,
            dto.Logo
        );

        await _context.SaveChangesAsync();

        return Ok(new { logo = company.Logo });
    }

[HttpDelete("logo")]
public async Task<IActionResult> DeleteLogo()
{
    var company = await _context.Company.FirstOrDefaultAsync();

    if (company == null)
        return NotFound("Company not found.");

    if (string.IsNullOrEmpty(company.Logo))
        return NotFound("Company logo not found.");

    _imageService.Delete(company.Logo);

    company.Logo = null;

    await _context.SaveChangesAsync();

    return NoContent();
}
}
