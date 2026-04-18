using System.Security.Claims;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Auth.Domain;

namespace Niklabs.Blog.Api.Auth;

public sealed class HttpContextCurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    private ClaimsPrincipal Principal => httpContextAccessor.HttpContext?.User ?? new ClaimsPrincipal(new ClaimsIdentity());

    public Guid? UserId => Guid.TryParse(Principal.FindFirstValue(ClaimTypes.NameIdentifier), out var parsedUserId)
        ? parsedUserId
        : null;

    public bool IsAuthenticated => Principal.Identity?.IsAuthenticated == true;

    public bool IsAdmin => Principal.IsInRole(AuthRoles.Admin);

    public bool CanCreatePosts => Principal.IsInRole(AuthRoles.Admin) || Principal.IsInRole(AuthRoles.User);
}
