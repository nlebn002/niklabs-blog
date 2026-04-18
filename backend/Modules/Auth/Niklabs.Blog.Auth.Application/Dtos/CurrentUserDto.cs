namespace Niklabs.Blog.Auth.Application.Dtos;

public sealed record CurrentUserDto(
    Guid UserId,
    string UserName,
    string? Email,
    IReadOnlyList<string> Roles);
