using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Niklabs.Auth.Application.Abstractions;
using Niklabs.Auth.Application.Dtos;
using Niklabs.Auth.Infrastructure.Identity;

namespace Niklabs.Auth.Infrastructure.Services;

public sealed class IdentityAuthGateway(
    SignInManager<AuthUser> signInManager,
    UserManager<AuthUser> userManager) : IAuthIdentityGateway
{
    public async Task<LoginResult> LoginAsync(
        string userNameOrEmail,
        string password,
        bool isPersistent,
        CancellationToken cancellationToken)
    {
        var normalizedInput = userNameOrEmail.Trim();
        var user = await FindUserAsync(normalizedInput);

        if (user is null || !user.IsActive)
        {
            return new LoginResult(false, null);
        }

        var signInResult = await signInManager.PasswordSignInAsync(
            user,
            password,
            isPersistent,
            lockoutOnFailure: true);

        if (!signInResult.Succeeded)
        {
            return new LoginResult(false, null);
        }

        var currentUser = await MapCurrentUserAsync(user);
        return new LoginResult(true, currentUser);
    }

    public Task LogoutAsync(CancellationToken cancellationToken) => signInManager.SignOutAsync();

    public async Task<CurrentUserDto?> GetCurrentUserAsync(ClaimsPrincipal principal, CancellationToken cancellationToken)
    {
        if (principal.Identity?.IsAuthenticated != true)
        {
            return null;
        }

        var user = await userManager.GetUserAsync(principal);
        if (user is null || !user.IsActive)
        {
            return null;
        }

        return await MapCurrentUserAsync(user);
    }

    private async Task<AuthUser?> FindUserAsync(string userNameOrEmail)
    {
        var user = await userManager.FindByNameAsync(userNameOrEmail);
        if (user is not null)
        {
            return user;
        }

        return userNameOrEmail.Contains('@')
            ? await userManager.FindByEmailAsync(userNameOrEmail)
            : null;
    }

    private async Task<CurrentUserDto> MapCurrentUserAsync(AuthUser user)
    {
        var roles = await userManager.GetRolesAsync(user);
        return new CurrentUserDto(user.Id, user.UserName ?? string.Empty, user.Email, roles.ToList());
    }
}
