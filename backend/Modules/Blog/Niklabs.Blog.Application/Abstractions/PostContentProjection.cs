namespace Niklabs.Blog.Application.Abstractions;

public sealed record PostContentProjection(
    string ContentJson,
    string ContentHtml,
    string ContentText);
