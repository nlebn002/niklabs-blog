# Migrations

This solution uses two EF Core contexts against the same PostgreSQL database:

- `Niklabs.Blog.Infrastructure.Persistence.BlogDbContext`
- `Niklabs.Auth.Infrastructure.Persistence.AuthDbContext`

They are separated by schema:

- posts: `post`
- auth: `auth`

Each context also writes its own `__EFMigrationsHistory` table into its own schema. Because of that, always run EF commands per context.

## Add Migration

### Blog

```bash
dotnet ef migrations add MigrationName --project backend/Modules/Blog/Niklabs.Blog.Infrastructure/Niklabs.Blog.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Blog.Infrastructure.Persistence.BlogDbContext --output-dir Migrations
```

### Auth

```bash
dotnet ef migrations add MigrationName --project backend/Modules/Auth/Niklabs.Auth.Infrastructure/Niklabs.Auth.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Auth.Infrastructure.Persistence.AuthDbContext --output-dir Migrations
```

## Update Database

### Blog

```bash
dotnet ef database update --project backend/Modules/Blog/Niklabs.Blog.Infrastructure/Niklabs.Blog.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Blog.Infrastructure.Persistence.BlogDbContext
```

### Auth

```bash
dotnet ef database update --project backend/Modules/Auth/Niklabs.Auth.Infrastructure/Niklabs.Auth.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Auth.Infrastructure.Persistence.AuthDbContext
```

## Remove Last Migration

### Blog

```bash
dotnet ef migrations remove --project backend/Modules/Blog/Niklabs.Blog.Infrastructure/Niklabs.Blog.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Blog.Infrastructure.Persistence.BlogDbContext
```

### Auth

```bash
dotnet ef migrations remove --project backend/Modules/Auth/Niklabs.Auth.Infrastructure/Niklabs.Auth.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Auth.Infrastructure.Persistence.AuthDbContext
```

## Generate SQL Scripts

`0` means "from the beginning". Write generated scripts into `scripts/migrations`.

### Blog full script

```bash
dotnet ef migrations script 0 --idempotent --project backend/Modules/Blog/Niklabs.Blog.Infrastructure/Niklabs.Blog.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Blog.Infrastructure.Persistence.BlogDbContext -o scripts/migrations/blog-migrations-all.sql
```

### Auth full script

```bash
dotnet ef migrations script 0 --idempotent --project backend/Modules/Auth/Niklabs.Auth.Infrastructure/Niklabs.Auth.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Auth.Infrastructure.Persistence.AuthDbContext -o scripts/migrations/auth-migrations-all.sql
```

### Blog range script

```bash
dotnet ef migrations script FromMigration ToMigration --idempotent --project backend/Modules/Blog/Niklabs.Blog.Infrastructure/Niklabs.Blog.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Blog.Infrastructure.Persistence.BlogDbContext -o scripts/migrations/blog-migrations-range.sql
```

### Auth range script

```bash
dotnet ef migrations script FromMigration ToMigration --idempotent --project backend/Modules/Auth/Niklabs.Auth.Infrastructure/Niklabs.Auth.Infrastructure.csproj --startup-project backend/Niklabs.Blog.Api/Niklabs.Api.csproj --context Niklabs.Auth.Infrastructure.Persistence.AuthDbContext -o scripts/migrations/auth-migrations-range.sql
```

## Notes

- The API project is the startup project for EF because it contains the runtime composition root.
- The migration output folder is `Migrations` relative to the selected infrastructure project.
- If a module has no migrations yet, EF will create the `Migrations` folder when you add the first migration.
- Ensure `scripts/migrations` exists before using the script generation commands.
- Do not assume one context's migration script covers the other context.
