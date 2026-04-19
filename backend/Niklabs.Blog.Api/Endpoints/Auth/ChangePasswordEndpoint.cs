using Niklabs.Auth.Application.Handlers.ChangePassword;
using Niklabs.Blog.Api.Auth;

namespace Niklabs.Blog.Api.Endpoints.Auth;

public static class ChangePasswordEndpoint
{
    public static RouteGroupBuilder MapChangePasswordEndpoint(this RouteGroupBuilder auth)
    {
        auth.MapPost("/change-password", async (
            HttpContext httpContext,
            ChangePasswordRequest request,
            ChangePasswordHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.ExecuteAsync(
                httpContext.User,
                new ChangePasswordCommand(request.CurrentPassword, request.NewPassword),
                cancellationToken);

            if (!result.Succeeded)
            {
                return Results.BadRequest(new ErrorResponse(result.ErrorMessage ?? "Password change failed."));
            }

            return Results.NoContent();
        })
        .RequireAuthorization()
        .AddEndpointFilter<AntiforgeryValidationFilter>()
        .Produces(StatusCodes.Status204NoContent)
        .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized);

        return auth;
    }
}

public sealed record ChangePasswordRequest(string CurrentPassword, string NewPassword);
