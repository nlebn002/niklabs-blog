using System.Security.Claims;
using Niklabs.Blog.Auth.Application.Dtos;

namespace Niklabs.Blog.Auth.Application.Abstractions;

public interface IAuthIdentityGateway
{
    Task<LoginResult> LoginAsync(string userNameOrEmail, string password, bool isPersistent, CancellationToken cancellationToken);
    Task LogoutAsync(CancellationToken cancellationToken);
    Task<CurrentUserDto?> GetCurrentUserAsync(ClaimsPrincipal principal, CancellationToken cancellationToken);
}
