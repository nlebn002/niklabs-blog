using System.Security.Claims;
using Niklabs.Auth.Application.Abstractions;
using Niklabs.Auth.Application.Dtos;

namespace Niklabs.Auth.Application.Handlers.GetCurrentUser;

public sealed class GetCurrentUserHandler(IAuthIdentityGateway identityGateway)
{
    public Task<CurrentUserDto?> ExecuteAsync(ClaimsPrincipal principal, CancellationToken cancellationToken)
    {
        return identityGateway.GetCurrentUserAsync(principal, cancellationToken);
    }
}
