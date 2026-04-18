using Niklabs.Blog.Auth.Application.Handlers.GetCurrentUser;

namespace Niklabs.Blog.Api.Endpoints.Auth;

public static class CurrentUserEndpoint
{
    public static RouteGroupBuilder MapCurrentUserEndpoint(this RouteGroupBuilder auth)
    {
        auth.MapGet("/me", async (HttpContext httpContext, GetCurrentUserHandler handler, CancellationToken cancellationToken) =>
        {
            var user = await handler.ExecuteAsync(httpContext.User, cancellationToken);
            return user is null ? Results.Unauthorized() : Results.Ok(user);
        })
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);

        return auth;
    }
}
