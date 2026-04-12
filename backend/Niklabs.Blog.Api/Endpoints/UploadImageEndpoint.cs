using Niklabs.Blog.Application.Handlers.UploadImage;

namespace Niklabs.Blog.Api.Endpoints;

public static class UploadImageEndpoint
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/uploads/images", async (
            HttpRequest request,
            UploadImageHandler handler,
            CancellationToken cancellationToken) =>
        {
            if (!request.HasFormContentType)
            {
                return Results.BadRequest(new { message = "Expected multipart form upload." });
            }

            var form = await request.ReadFormAsync(cancellationToken);
            var file = form.Files["file"];
            if (file is null || file.Length == 0)
            {
                return Results.BadRequest(new { message = "Image file is required." });
            }

            await using var stream = file.OpenReadStream();
            var url = await handler.ExecuteAsync(stream, file.FileName, cancellationToken);
            return Results.Ok(new { url });
        }).DisableAntiforgery();
    }
}
