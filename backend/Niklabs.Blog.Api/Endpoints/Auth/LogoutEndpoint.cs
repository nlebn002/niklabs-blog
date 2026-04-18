using Niklabs.Blog.Api.Auth;
using Niklabs.Auth.Application.Handlers.Logout;

namespace Niklabs.Blog.Api.Endpoints.Auth;

public static class LogoutEndpoint
{
    public static RouteGroupBuilder MapLogoutEndpoint(this RouteGroupBuilder auth)
    {
        auth.MapPost("/logout", async (LogoutHandler handler, CancellationToken cancellationToken) =>
        {
            await handler.ExecuteAsync(cancellationToken);
            return Results.NoContent();
        })
        .RequireAuthorization()
        .AddEndpointFilter<AntiforgeryValidationFilter>()
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status401Unauthorized);

        return auth;
    }
}
