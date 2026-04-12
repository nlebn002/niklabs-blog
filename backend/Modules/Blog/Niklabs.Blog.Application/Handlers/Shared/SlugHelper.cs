namespace Niklabs.Blog.Application.Handlers.Shared;

internal static class SlugHelper
{
    public static string Generate(string title, string? preferredSlug)
    {
        var source = string.IsNullOrWhiteSpace(preferredSlug) ? title : preferredSlug;
        var normalized = new string(source
            .Trim()
            .ToLowerInvariant()
            .Select(ch => char.IsLetterOrDigit(ch) ? ch : '-')
            .ToArray());

        var parts = normalized.Split('-', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return parts.Length == 0 ? Guid.NewGuid().ToString("N") : string.Join('-', parts);
    }
}
