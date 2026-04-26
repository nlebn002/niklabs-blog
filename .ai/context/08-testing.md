# Testing

Test changes at the narrowest level that catches the risk.

Defaults:
- Backend behavior: unit or integration tests near the owning backend test project.
- EF/query changes: include tests that exercise real mapping/query behavior when practical.
- Frontend behavior: component or integration tests if the repo has an established frontend test setup.
- API contract changes: verify backend build and Orval generation.

Run relevant builds/tests before handoff and report any skipped verification.

