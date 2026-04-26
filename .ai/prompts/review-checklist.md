# Review Checklist

Check for:

- Contract drift between backend OpenAPI and generated Orval client.
- Authorization, cookie, and CSRF behavior regressions.
- Blog/Auth module boundary violations.
- EF migration safety and correct DbContext ownership.
- Frontend layering and generated-client usage.
- Missing tests for changed behavior.
- Secret leakage or environment-specific paths.
- Unrelated formatting or refactors.

