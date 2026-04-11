# niklabs.cloud blog MVP

This repository contains a deployable MVP for `niklabs.cloud` built with:

- .NET 10 and C# 14 preview
- Minimal API backend with vertical slices and clean architecture boundaries
- PostgreSQL for persistence
- Aspire AppHost and OpenTelemetry service defaults for local orchestration
- React + Tailwind frontend
- Docker Compose for deployment
- GitHub Actions for CI

## Solution structure

- `src/Orchestration/Niklabs.Blog.AppHost` Aspire orchestrator for local development
- `src/Orchestration/Niklabs.Blog.ServiceDefaults` shared service defaults and telemetry setup
- `src/Modules/Blog/Niklabs.Blog.Api` blog module API entrypoint
- `src/Modules/Blog/Niklabs.Blog.Application` blog module application layer
- `src/Modules/Blog/Niklabs.Blog.Domain` blog module domain model
- `src/Modules/Blog/Niklabs.Blog.Infrastructure` blog module persistence and storage
- `frontend` React + Tailwind SPA
- `deploy` Dockerfiles and deployment assets
- `.github/workflows` CI pipeline

## MVP behavior

- Public visitors can list published posts and view a post by slug
- Admins can create, update, delete, publish, and unpublish posts
- Admins can upload images and reference them from post content
- Admin access is protected with `X-Admin-Key`

## Run locally

### Backend only

1. Start PostgreSQL with Docker Compose.
2. Set `ConnectionStrings__blogdb` and `Admin__ApiKey`.
3. Run `dotnet run --project src/Modules/Blog/Niklabs.Blog.Api`.

### Full stack with containers

1. Copy `.env.example` to `.env`
2. Set your values
3. Run `docker compose up --build`

### Aspire

Run `dotnet run --project src/Orchestration/Niklabs.Blog.AppHost` for local orchestration.
