using System.Net;
using System.Text;
using System.Text.Json;
using Niklabs.Blog.Application.Abstractions;

namespace Niklabs.Blog.Application.Services;

public sealed class LexicalContentProjectionService : IPostContentProjectionService
{
    public PostContentProjection Project(string editorStateJson)
    {
        var normalizedJson = string.IsNullOrWhiteSpace(editorStateJson)
            ? throw new ArgumentException("editorStateJson is required.", nameof(editorStateJson))
            : editorStateJson.Trim();

        using var document = JsonDocument.Parse(normalizedJson);
        var root = document.RootElement.GetProperty("root");

        var html = RenderChildrenToHtml(root);
        var text = RenderChildrenToText(root).Trim();

        return new PostContentProjection(normalizedJson, html, text);
    }

    private static string RenderChildrenToHtml(JsonElement node)
    {
        var builder = new StringBuilder();

        if (node.TryGetProperty("children", out var children))
        {
            foreach (var child in children.EnumerateArray())
            {
                builder.Append(RenderNodeToHtml(child));
            }
        }

        return builder.ToString();
    }

    private static string RenderNodeToHtml(JsonElement node)
    {
        var type = node.GetProperty("type").GetString();

        return type switch
        {
            "paragraph" => WrapBlock("p", RenderChildrenToHtml(node), "<br />"),
            "heading" => WrapBlock(GetHeadingTag(node), RenderChildrenToHtml(node), "<br />"),
            "quote" => WrapBlock("blockquote", RenderChildrenToHtml(node), string.Empty),
            "list" => WrapBlock(GetListTag(node), RenderChildrenToHtml(node), string.Empty),
            "listitem" => WrapBlock("li", RenderChildrenToHtml(node), string.Empty),
            "linebreak" => "<br />",
            "link" => RenderLink(node),
            "text" => RenderTextHtml(node),
            _ => RenderChildrenToHtml(node)
        };
    }

    private static string RenderChildrenToText(JsonElement node)
    {
        var builder = new StringBuilder();

        if (node.TryGetProperty("children", out var children))
        {
            foreach (var child in children.EnumerateArray())
            {
                builder.Append(RenderNodeToText(child));
            }
        }

        return builder.ToString();
    }

    private static string RenderNodeToText(JsonElement node)
    {
        var type = node.GetProperty("type").GetString();

        return type switch
        {
            "paragraph" => AppendBlock(RenderChildrenToText(node)),
            "heading" => AppendBlock(RenderChildrenToText(node)),
            "quote" => AppendBlock(RenderChildrenToText(node)),
            "list" => AppendBlock(RenderChildrenToText(node)),
            "listitem" => $"- {RenderChildrenToText(node).Trim()}{Environment.NewLine}",
            "linebreak" => Environment.NewLine,
            "link" => RenderChildrenToText(node),
            "text" => node.TryGetProperty("text", out var textNode) ? textNode.GetString() ?? string.Empty : string.Empty,
            _ => RenderChildrenToText(node)
        };
    }

    private static string RenderTextHtml(JsonElement node)
    {
        var text = node.TryGetProperty("text", out var textNode) ? textNode.GetString() ?? string.Empty : string.Empty;
        var encoded = WebUtility.HtmlEncode(text);

        if (!node.TryGetProperty("format", out var formatNode) || formatNode.ValueKind != JsonValueKind.Number)
        {
            return encoded;
        }

        var format = formatNode.GetInt32();

        if ((format & 1) != 0)
        {
            encoded = $"<strong>{encoded}</strong>";
        }

        if ((format & 2) != 0)
        {
            encoded = $"<em>{encoded}</em>";
        }

        if ((format & 8) != 0)
        {
            encoded = $"<u>{encoded}</u>";
        }

        if ((format & 16) != 0)
        {
            encoded = $"<code>{encoded}</code>";
        }

        return encoded;
    }

    private static string RenderLink(JsonElement node)
    {
        var href = node.TryGetProperty("url", out var urlNode) ? urlNode.GetString() ?? string.Empty : string.Empty;
        var encodedHref = WebUtility.HtmlEncode(href);
        var body = RenderChildrenToHtml(node);

        return string.IsNullOrWhiteSpace(encodedHref)
            ? body
            : $"<a href=\"{encodedHref}\" rel=\"noopener noreferrer\">{body}</a>";
    }

    private static string GetHeadingTag(JsonElement node)
    {
        if (!node.TryGetProperty("tag", out var tagNode))
        {
            return "h2";
        }

        var tag = tagNode.GetString();
        return tag is "h1" or "h2" or "h3" or "h4" or "h5" or "h6" ? tag : "h2";
    }

    private static string GetListTag(JsonElement node)
    {
        if (!node.TryGetProperty("listType", out var listTypeNode))
        {
            return "ul";
        }

        return listTypeNode.GetString() == "number" ? "ol" : "ul";
    }

    private static string WrapBlock(string tag, string body, string emptyFallback)
    {
        var content = string.IsNullOrWhiteSpace(body) ? emptyFallback : body;
        return $"<{tag}>{content}</{tag}>";
    }

    private static string AppendBlock(string text)
    {
        var normalized = text.Trim();
        return string.IsNullOrWhiteSpace(normalized)
            ? string.Empty
            : $"{normalized}{Environment.NewLine}{Environment.NewLine}";
    }
}
