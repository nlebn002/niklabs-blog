using Niklabs.Auth.Application.Handlers.Login;

namespace Niklabs.Blog.Api.Endpoints.Auth;

public static class LoginEndpoint
{
    public static RouteGroupBuilder MapLoginEndpoint(this RouteGroupBuilder auth)
    {
        auth.MapPost("/login", async (
            LoginRequest request,
            LoginHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.ExecuteAsync(
                new LoginCommand(
                    request.UserNameOrEmail,
                    request.Password,
                    request.RememberMe),
                cancellationToken);

            if (!result.Succeeded)
            {
                return Results.Json(
                    new ErrorResponse("Invalid username, email, or password."),
                    statusCode: StatusCodes.Status401Unauthorized);
            }

            return Results.Ok(result.User);
        })
        .AllowAnonymous()
        .Produces(StatusCodes.Status200OK)
        .Produces<ErrorResponse>(StatusCodes.Status401Unauthorized);

        return auth;
    }
}

public sealed record LoginRequest(string UserNameOrEmail, string Password, bool RememberMe);
public sealed record ErrorResponse(string Message);
