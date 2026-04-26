using Niklabs.Blog.Api.Auth;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Domain.Media;

namespace Niklabs.Blog.Api.Endpoints.Media;

public static class UploadImageEndpoint
{
    public static RouteGroupBuilder MapUploadImageEndpoint(this RouteGroupBuilder media)
    {
        media.MapPost("/images", async (
            IFormFile file,
            IMediaService mediaService,
            ICurrentUser currentUser,
            string? altText,
            MediaAssetKind? kind,
            Guid? postId,
            CancellationToken cancellationToken) =>
        {
            if (!currentUser.CanCreatePosts || !currentUser.UserId.HasValue)
            {
                return Results.Forbid();
            }

            await using var stream = file.OpenReadStream();

            try
            {
                var result = await mediaService.UploadImageAsync(
                    new MediaAssetUploadRequest(
                        currentUser.UserId.Value,
                        file.FileName,
                        file.ContentType,
                        file.Length,
                        stream,
                        kind ?? MediaAssetKind.Cover,
                        postId,
                        altText),
                    cancellationToken);

                return Results.Ok(new UploadImageResponse(
                    result.MediaAssetId,
                    result.PublicUrl,
                    result.ContentType,
                    result.SizeBytes,
                    result.Width,
                    result.Height,
                    result.AltText));
            }
            catch (Exception exception) when (exception is ArgumentException or InvalidOperationException)
            {
                return Results.BadRequest(new { message = exception.Message });
            }
        })
        .RequireAuthorization("CanCreatePosts")
        .AddEndpointFilter<AntiforgeryValidationFilter>()
        .Accepts<IFormFile>("multipart/form-data")
        .Produces<UploadImageResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status403Forbidden);

        return media;
    }
}
