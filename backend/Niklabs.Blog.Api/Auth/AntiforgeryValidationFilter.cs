using Microsoft.AspNetCore.Antiforgery;

namespace Niklabs.Blog.Api.Auth;

public sealed class AntiforgeryValidationFilter(IAntiforgery antiforgery) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var httpContext = context.HttpContext;

        if (HttpMethods.IsGet(httpContext.Request.Method)
            || HttpMethods.IsHead(httpContext.Request.Method)
            || HttpMethods.IsOptions(httpContext.Request.Method)
            || HttpMethods.IsTrace(httpContext.Request.Method))
        {
            return await next(context);
        }

        try
        {
            await antiforgery.ValidateRequestAsync(httpContext);
        }
        catch (AntiforgeryValidationException)
        {
            return Results.BadRequest(new { message = "Invalid CSRF token." });
        }

        return await next(context);
    }
}
