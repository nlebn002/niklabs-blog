namespace Niklabs.Auth.Application.Dtos;

public sealed record CurrentUserDto(
    Guid UserId,
    string UserName,
    string? Email,
    IReadOnlyList<string> Roles);
