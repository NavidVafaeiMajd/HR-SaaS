using System.ComponentModel.DataAnnotations;

namespace HrSaaS.Models;

public class Company : IAuditable
{
    public Guid Id { get; set; }

    // Basic information
    [MaxLength(200)]
    public string Name { get; set; } = "";

    [MaxLength(250)]
    public string? LegalName { get; set; }

    [MaxLength(50)]
    public string? NationalId { get; set; }

    [MaxLength(50)]
    public string? RegistrationNumber { get; set; }

    [MaxLength(50)]
    public string? EconomicCode { get; set; }

    [MaxLength(100)]
    public string? CompanyType { get; set; }

    public DateTime? FoundedDate { get; set; }

    [MaxLength(500)]
    public string? Logo { get; set; }

    public string? Description { get; set; }

    // Contact information
    [MaxLength(30)]
    public string? Phone { get; set; }

    [MaxLength(30)]
    public string? Mobile { get; set; }

    [MaxLength(150)]
    public string? Email { get; set; }

    [MaxLength(250)]
    public string? Website { get; set; }

    [MaxLength(30)]
    public string? Fax { get; set; }

    // Address
    [MaxLength(100)]
    public string? Country { get; set; }

    [MaxLength(100)]
    public string? Province { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    public string? Address { get; set; }

    [MaxLength(20)]
    public string? PostalCode { get; set; }

    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}