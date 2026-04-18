using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;

namespace Niklabs.Blog.Api.Endpoints.Auth;

public static class CsrfEndpoint
{
    public static RouteGroupBuilder MapCsrfEndpoint(this RouteGroupBuilder auth)
    {
        auth.MapGet("/csrf", [Authorize] (HttpContext httpContext, IAntiforgery antiforgery) =>
        {
            var tokens = antiforgery.GetAndStoreTokens(httpContext);
            return Results.Ok(new CsrfTokenResponse(tokens.RequestToken ?? string.Empty));
        })
        .Produces<CsrfTokenResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);

        return auth;
    }
}

public sealed record CsrfTokenResponse(string RequestToken);
