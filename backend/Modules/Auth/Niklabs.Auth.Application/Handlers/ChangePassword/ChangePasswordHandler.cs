using System.Security.Claims;
using Niklabs.Auth.Application.Abstractions;
using Niklabs.Auth.Application.Dtos;

namespace Niklabs.Auth.Application.Handlers.ChangePassword;

public sealed class ChangePasswordHandler(IAuthIdentityGateway identityGateway)
{
    public Task<ChangePasswordResult> ExecuteAsync(
        ClaimsPrincipal principal,
        ChangePasswordCommand command,
        CancellationToken cancellationToken)
    {
        return identityGateway.ChangePasswordAsync(
            principal,
            command.CurrentPassword,
            command.NewPassword,
            cancellationToken);
    }
}

public sealed record ChangePasswordCommand(string CurrentPassword, string NewPassword);
