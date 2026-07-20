using Microsoft.AspNetCore.Identity;


public class Users : IdentityUser
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
}
