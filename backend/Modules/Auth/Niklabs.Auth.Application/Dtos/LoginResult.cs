namespace Niklabs.Auth.Application.Dtos;

public sealed record LoginResult(bool Succeeded, CurrentUserDto? User);
