# Add Endpoint

When adding a backend endpoint:

1. Find the owning module and nearest existing endpoint pattern.
2. Add request/response types, handler logic, validation, and DI using local conventions.
3. Keep persistence inside the owning module's EF context.
4. Update OpenAPI-visible metadata when request or response shape changes.
5. Add focused tests for behavior and authorization.
6. Regenerate the Orval client if the frontend contract changed.

