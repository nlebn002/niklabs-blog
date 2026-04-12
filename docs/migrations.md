# new migrations
--project where migrations live; --startup-project how dbContext is created
dotnet ef migrations add init --project backend\Modules\Blog\Niklabs.Blog.Infrastructure --startup-project backend\Niklabs.Blog.Api

# migration scripts
script 0 → full DB creation
script Init AddPosts → only changes between those migrations
script Init → from Init → latest

--idempotent
makes script safe to run multiple times
checks __EFMigrationsHistory before applying

## from the beginning
dotnet ef migrations script 0 --idempotent --project backend/Modules/Blog/Niklabs.Blog.Infrastructure --startup-project backend/Niklabs.Blog.Api -o migrations.sql

## from to
dotnet ef migrations script FromMigration ToMigration --idempotent --project backend/Modules/Blog/Niklabs.Blog.Infrastructure --startup-project backend/Niklabs.Blog.Api -o migrations.sql

## from the beginning to latest
dotnet ef migrations script Init --idempotent --project backend/Modules/Blog/Niklabs.Blog.Infrastructure --startup-project backend/Niklabs.Blog.Api -o migrations.sql