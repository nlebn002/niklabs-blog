using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Domain.Posts;

namespace Niklabs.Blog.Application.Services;

public sealed class PostAuthorizationService : IPostAuthorizationService
{
    public bool CanCreate(ICurrentUser currentUser) => currentUser.CanCreatePosts;

    public bool CanView(ICurrentUser currentUser, Post post)
    {
        return post.Status == PostStatus.Published
            || currentUser.IsAdmin
            || (currentUser.UserId.HasValue && post.AuthorUserId == currentUser.UserId.Value);
    }

    public bool CanEdit(ICurrentUser currentUser, Post post)
    {
        return currentUser.CanCreatePosts
            && (currentUser.IsAdmin || (currentUser.UserId.HasValue && post.AuthorUserId == currentUser.UserId.Value));
    }

    public bool CanDelete(ICurrentUser currentUser, Post post) => CanEdit(currentUser, post);
}
