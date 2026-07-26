//it is automate add permission attribute and then we just add to program.cs as service (go program.cs)
using Microsoft.AspNetCore.Authorization;

public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement
    )
    {
        if (context.User.IsInRole("Admin"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        var permissions = context
            .User.Claims.Where(c => c.Type == "permission")
            .Select(c => c.Value);

        if (permissions.Contains(requirement.Permission))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
