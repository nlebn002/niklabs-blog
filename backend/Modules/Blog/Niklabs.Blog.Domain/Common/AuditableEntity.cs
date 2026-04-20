namespace Niklabs.Blog.Domain.Common;

public abstract class AuditableEntity<TId> : Entity<TId>
{
    public DateTimeOffset CreatedAtUtc { get; protected set; }

    public DateTimeOffset UpdatedAtUtc { get; protected set; }

    protected void SetCreated(DateTimeOffset nowUtc)
    {
        CreatedAtUtc = nowUtc;
        UpdatedAtUtc = nowUtc;
    }

    protected void Touch(DateTimeOffset nowUtc)
    {
        UpdatedAtUtc = nowUtc;
    }
}
