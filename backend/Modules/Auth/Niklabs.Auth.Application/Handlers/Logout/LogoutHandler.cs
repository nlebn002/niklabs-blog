using Niklabs.Auth.Application.Abstractions;

namespace Niklabs.Auth.Application.Handlers.Logout;

public sealed class LogoutHandler(IAuthIdentityGateway identityGateway)
{
    public Task ExecuteAsync(CancellationToken cancellationToken)
    {
        return identityGateway.LogoutAsync(cancellationToken);
    }
}
