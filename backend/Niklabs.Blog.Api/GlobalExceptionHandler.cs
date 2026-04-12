using Microsoft.AspNetCore.Diagnostics;

namespace Niklabs.Blog.Api;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    public ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        return ValueTask.FromResult(false);
    }
}
