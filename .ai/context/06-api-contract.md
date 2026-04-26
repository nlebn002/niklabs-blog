# API Contract

The backend OpenAPI document is the contract for the frontend client.

Rules:
- Backend endpoint changes that affect request or response shape must update OpenAPI.
- Regenerate the frontend client with the repo's Orval flow after API contract changes.
- Commit generated client changes with the backend/frontend changes that require them.
- Do not hand-edit generated Orval output except as a temporary debugging step.

Frontend API generation reference: `frontend/README.md`

