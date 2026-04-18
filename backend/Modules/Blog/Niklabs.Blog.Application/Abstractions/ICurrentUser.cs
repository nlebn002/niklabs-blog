namespace Niklabs.Blog.Application.Abstractions;

public interface ICurrentUser
{
    Guid? UserId { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
    bool CanCreatePosts { get; }
}
