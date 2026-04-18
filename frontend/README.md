# Frontend

This folder contains the React + Vite SPA for the blog admin and public post pages.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router
- Orval for OpenAPI-based API client generation

## How to run the frontend

### Prerequisites

- Node.js installed
- Backend API running locally

### Install dependencies

```powershell
cd frontend
npm install
```

### Start the frontend in development

```powershell
cd frontend
npm run dev
```

Vite starts the app on `http://localhost:3000`.

## Backend requirements for local development

The frontend dev server is configured in [vite.config.ts](/C:/Users/nik/source/repos/niklabs-blog/frontend/vite.config.ts:1) to proxy all `/api` requests to:

`http://localhost:5001`

That means the simplest working local setup is:

1. Start the backend so it is reachable on `http://localhost:5001`
2. Start the frontend with `npm run dev`

For local frontend work, the simplest option is to run the API project directly:

```powershell
dotnet run --project backend/Niklabs.Blog.Api
```

The API project's `launchSettings.json` already uses `http://localhost:5001`, which matches the frontend default.

If you want to point the frontend to another backend origin, change `API_URL` in `frontend/.env`.

If you run the Aspire AppHost, note that `http://localhost:5000` is the AppHost/dashboard, not the blog API itself. Do not use that port as `API_URL` unless you explicitly add API routing in front of it.

## Environment variables

Copy [`.env.example`](/C:/Users/nik/source/repos/niklabs-blog/frontend/.env.example:1) to `frontend/.env`.

```env
API_URL=http://localhost:5001
```

### `API_URL`

- Used by [vite.config.ts](/C:/Users/nik/source/repos/niklabs-blog/frontend/vite.config.ts:1) as the Vite proxy target
- Used by [orval.config.ts](/C:/Users/nik/source/repos/niklabs-blog/frontend/orval.config.ts:1) to build the OpenAPI document URL
- Default local value is `http://localhost:5001`

The browser app itself does not use `API_URL` directly. It keeps calling relative `/api/*` endpoints, and Vite proxies those requests to `API_URL`. This keeps local cookie and CSRF behavior on the same origin from the browser perspective.

## How the frontend communicates with the backend

The frontend does not call the backend directly from page components. The flow is:

1. UI/features call hooks from [posts.ts](/C:/Users/nik/source/repos/niklabs-blog/frontend/src/shared/api/hooks/posts.ts:1) and [hooks.ts](/C:/Users/nik/source/repos/niklabs-blog/frontend/src/features/auth/api/hooks.ts:1)
2. Those hooks call generated functions from [blog-api.ts](/C:/Users/nik/source/repos/niklabs-blog/frontend/src/shared/api/generated/blog-api.ts:1)
3. The generated client uses the custom mutator in [custom-fetch.ts](/C:/Users/nik/source/repos/niklabs-blog/frontend/src/shared/api/client/custom-fetch.ts:1)
4. `customFetch` sends relative `/api/*` requests, includes cookies with `credentials: "include"`, and handles CSRF tokens for write operations

### Request model

The generated client talks to these backend route groups:

- `/api/posts`
- `/api/auth`

Current generated operations include:

- `GET /api/posts`
- `GET /api/posts/{id}`
- `POST /api/posts`
- `PUT /api/posts/{id}`
- `DELETE /api/posts/{id}`
- `GET /api/auth/me`
- `GET /api/auth/csrf`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Authentication and CSRF

The backend auth endpoints are defined under [backend/Niklabs.Blog.Api/Endpoints/Auth](</C:/Users/nik/source/repos/niklabs-blog/backend/Niklabs.Blog.Api/Endpoints/Auth>).

Important behavior:

- The frontend always sends cookies by using `credentials: "include"`
- Before `POST`, `PUT`, `PATCH`, or `DELETE`, `customFetch` tries to fetch `/api/auth/csrf`
- If a token is returned, it is sent in the `X-CSRF-TOKEN` header
- On `401`, the cached CSRF token is cleared

This matches the backend antiforgery setup in [Program.cs](/C:/Users/nik/source/repos/niklabs-blog/backend/Niklabs.Blog.Api/Program.cs:1), where the API expects the `X-CSRF-TOKEN` header.

## How to generate contracts from OpenAPI

The frontend uses Orval to generate TypeScript types and client functions from the backend OpenAPI document.

### Source OpenAPI document

In development, the backend exposes OpenAPI at:

`{API_URL}/openapi/v1.json`

With the default local config, that is:

`http://localhost:5001/openapi/v1.json`

This comes from `app.MapOpenApi()` in [backend/Niklabs.Blog.Api/Program.cs](/C:/Users/nik/source/repos/niklabs-blog/backend/Niklabs.Blog.Api/Program.cs:1).

### Generate once

```powershell
cd frontend
npm run generate:api
```

### Generate in watch mode

```powershell
cd frontend
npm run generate:api:watch
```

### Output location

Generated files are written under:

- [src/shared/api/generated/auth](</C:/Users/nik/source/repos/niklabs-blog/frontend/src/shared/api/generated/auth>)
- [src/shared/api/generated/blog](</C:/Users/nik/source/repos/niklabs-blog/frontend/src/shared/api/generated/blog>)

Structure:

- `generated/auth/apis.ts`
- `generated/auth/models.ts`
- `generated/blog/apis.ts`
- `generated/blog/models.ts`

Those are the public entrypoints used by the app. Orval generates the internal files under `generated/<domain>/apis/` and `generated/<domain>/models/`, and the top-level `apis.ts` / `models.ts` files re-export them.

Generation is split by OpenAPI tag:

- `Auth` endpoints generate into `generated/auth/*`
- `Blog` endpoints generate into `generated/blog/*`

### Generation flow

1. Start the backend so `/openapi/v1.json` is reachable
2. Ensure `API_URL` points to the correct backend origin
3. Run `npm run generate:api`
4. Commit the updated generated files if the contract changed

The generation scripts load `frontend/.env` explicitly via `node --env-file=.env`, fetch the OpenAPI document from `{API_URL}/openapi/v1.json`, store it in `frontend/.orval/openapi-v1.json`, and then run Orval against that local file. This avoids Orval's Windows URL-path issue while keeping `API_URL` as the single backend variable.

## Production notes

In production, the frontend is built with Vite and served by nginx. The included [nginx.conf](/C:/Users/nik/source/repos/niklabs-blog/frontend/nginx.conf:1) only handles SPA routing and static files. It does not define an API proxy, so production routing between frontend and backend must be handled by the deployment layer.
