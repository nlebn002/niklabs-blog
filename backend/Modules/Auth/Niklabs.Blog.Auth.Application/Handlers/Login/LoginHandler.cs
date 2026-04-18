using Niklabs.Blog.Auth.Application.Abstractions;
using Niklabs.Blog.Auth.Application.Dtos;

namespace Niklabs.Blog.Auth.Application.Handlers.Login;

public sealed class LoginHandler(IAuthIdentityGateway identityGateway)
{
    public Task<LoginResult> ExecuteAsync(LoginCommand command, CancellationToken cancellationToken)
    {
        return identityGateway.LoginAsync(
            command.UserNameOrEmail,
            command.Password,
            command.RememberMe,
            cancellationToken);
    }
}

public sealed record LoginCommand(string UserNameOrEmail, string Password, bool RememberMe);
