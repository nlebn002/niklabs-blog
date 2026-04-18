using Niklabs.Blog.Auth.Application.Abstractions;

namespace Niklabs.Blog.Auth.Application.Handlers.Logout;

public sealed class LogoutHandler(IAuthIdentityGateway identityGateway)
{
    public Task ExecuteAsync(CancellationToken cancellationToken)
    {
        return identityGateway.LogoutAsync(cancellationToken);
    }
}
