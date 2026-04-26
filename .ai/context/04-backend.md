# Backend

Follow the existing backend layout under `backend/`.

Implementation defaults:
- Use minimal API endpoints where the app already uses them.
- Put request handling in the local handler or vertical-slice pattern already present.
- Register services through the module's existing DI entry points.
- Keep Blog and Auth EF contexts separate.
- Add migrations with the documented commands, not ad hoc variants.

Migration reference: `docs/migrations.md`

