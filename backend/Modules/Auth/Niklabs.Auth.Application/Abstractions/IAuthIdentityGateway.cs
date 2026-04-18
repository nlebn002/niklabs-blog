using System.Security.Claims;
using Niklabs.Auth.Application.Dtos;

namespace Niklabs.Auth.Application.Abstractions;

public interface IAuthIdentityGateway
{
    Task<LoginResult> LoginAsync(string userNameOrEmail, string password, bool isPersistent, CancellationToken cancellationToken);
    Task LogoutAsync(CancellationToken cancellationToken);
    Task<CurrentUserDto?> GetCurrentUserAsync(ClaimsPrincipal principal, CancellationToken cancellationToken);
}
