# Regenerate OpenAPI And Orval

Use this when endpoint contracts change:

1. Build or run the backend as required by the repo's OpenAPI generation flow.
2. Regenerate the OpenAPI document if it is committed.
3. In `frontend/`, run the documented Orval generation command.
4. Review generated diffs for expected request/response changes only.
5. Run frontend build or typecheck.

Reference: `frontend/README.md`

