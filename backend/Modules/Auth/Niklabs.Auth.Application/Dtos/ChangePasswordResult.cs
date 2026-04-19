namespace Niklabs.Auth.Application.Dtos;

public sealed record ChangePasswordResult(bool Succeeded, string? ErrorMessage);
