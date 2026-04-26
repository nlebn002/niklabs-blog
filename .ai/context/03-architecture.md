# Architecture

The backend is a modular monolith. Keep module boundaries explicit and avoid leaking implementation details across modules.

Use vertical slices for feature work where the repo already follows that pattern. Keep API endpoints, handlers, validation, persistence, and tests close enough that a feature can be reasoned about as one unit.

Clean-boundary rules:
- Modules communicate through public contracts, not another module's internals.
- Shared abstractions belong in established shared projects or folders only when reuse is real.
- Keep persistence details inside the owning module.

