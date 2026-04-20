namespace Niklabs.Blog.Application.Abstractions;

public interface IPostContentProjectionService
{
    PostContentProjection Project(string editorStateJson);
}
