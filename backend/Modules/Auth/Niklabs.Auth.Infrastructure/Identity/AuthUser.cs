using Microsoft.AspNetCore.Identity;

namespace Niklabs.Auth.Infrastructure.Identity;

public sealed class AuthUser : IdentityUser<Guid>
{
    public bool IsActive { get; set; } = true;
}
