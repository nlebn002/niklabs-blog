using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Abstractions;

public interface IPostAuthorizationService
{
    bool CanCreate(ICurrentUser currentUser);
    bool CanView(ICurrentUser currentUser, Post post);
    bool CanEdit(ICurrentUser currentUser, Post post);
    bool CanDelete(ICurrentUser currentUser, Post post);
}
