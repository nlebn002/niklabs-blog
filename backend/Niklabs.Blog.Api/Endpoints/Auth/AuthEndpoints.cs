namespace Niklabs.Blog.Api.Endpoints.Auth;

public static class AuthEndpoints
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        var auth = endpoints.MapGroup("/api/auth").WithTags("Auth");

        auth.MapLoginEndpoint();
        auth.MapLogoutEndpoint();
        auth.MapCurrentUserEndpoint();
        auth.MapCsrfEndpoint();
    }
}
