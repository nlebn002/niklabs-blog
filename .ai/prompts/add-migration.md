# Add Migration

Use `docs/migrations.md` as the command source of truth.

Rules:
- Run Blog and Auth context migrations separately.
- Name migrations after the domain change, not the implementation detail.
- Review generated migration code before committing.
- Run `dotnet build` after migration changes.

