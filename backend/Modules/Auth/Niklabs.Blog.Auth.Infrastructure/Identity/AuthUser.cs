using Microsoft.AspNetCore.Identity;

namespace Niklabs.Blog.Auth.Infrastructure.Identity;

public sealed class AuthUser : IdentityUser<Guid>
{
    public bool IsActive { get; set; } = true;
}
