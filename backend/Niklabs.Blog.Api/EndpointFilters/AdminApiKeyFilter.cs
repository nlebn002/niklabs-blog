namespace Niklabs.Blog.Api.EndpointFilters;

public sealed class AdminApiKeyFilter(IConfiguration configuration) : IEndpointFilter
{
    public ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var configuredApiKey = configuration["Admin:ApiKey"];
        if (string.IsNullOrWhiteSpace(configuredApiKey))
        {
            return ValueTask.FromResult<object?>(Results.Problem("Admin API key is not configured.", statusCode: 500));
        }

        var providedApiKey = context.HttpContext.Request.Headers["X-Admin-Key"].FirstOrDefault();
        if (!string.Equals(providedApiKey, configuredApiKey, StringComparison.Ordinal))
        {
            return ValueTask.FromResult<object?>(Results.Unauthorized());
        }

        return next(context);
    }
}
