namespace Niklabs.Blog.Api.Endpoints.Media;

public static class MediaEndpoints
{
    public static void Map(IEndpointRouteBuilder endpoints)
    {
        var media = endpoints.MapGroup("/api/media").WithTags("Media");
        media.MapUploadImageEndpoint();
    }
}
