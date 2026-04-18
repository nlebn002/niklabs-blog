using System.Security.Claims;
using Niklabs.Blog.Auth.Application.Abstractions;
using Niklabs.Blog.Auth.Application.Dtos;

namespace Niklabs.Blog.Auth.Application.Handlers.GetCurrentUser;

public sealed class GetCurrentUserHandler(IAuthIdentityGateway identityGateway)
{
    public Task<CurrentUserDto?> ExecuteAsync(ClaimsPrincipal principal, CancellationToken cancellationToken)
    {
        return identityGateway.GetCurrentUserAsync(principal, cancellationToken);
    }
}
