//this is just for easy input in Permission input on attribute
using Microsoft.AspNetCore.Authorization;

public class PermissionAttribute : AuthorizeAttribute
{
    public PermissionAttribute(Permission permission)
    {
        Policy = permission.ToString();
    }
}