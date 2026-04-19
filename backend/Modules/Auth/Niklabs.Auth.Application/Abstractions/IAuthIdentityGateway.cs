using System.Security.Claims;
using Niklabs.Auth.Application.Dtos;

namespace Niklabs.Auth.Application.Abstractions;

public interface IAuthIdentityGateway
{
    Task<LoginResult> LoginAsync(string userNameOrEmail, string password, bool isPersistent, CancellationToken cancellationToken);
    Task<ChangePasswordResult> ChangePasswordAsync(ClaimsPrincipal principal, string currentPassword, string newPassword, CancellationToken cancellationToken);
    Task LogoutAsync(CancellationToken cancellationToken);
    Task<CurrentUserDto?> GetCurrentUserAsync(ClaimsPrincipal principal, CancellationToken cancellationToken);
}
