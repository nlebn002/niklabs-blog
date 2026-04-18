DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = 'post') THEN
        CREATE SCHEMA post;
    END IF;
END $EF$;
CREATE TABLE IF NOT EXISTS post."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM post."__EFMigrationsHistory" WHERE "MigrationId" = '20260418142729_init') THEN
        IF NOT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = 'post') THEN
            CREATE SCHEMA post;
        END IF;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM post."__EFMigrationsHistory" WHERE "MigrationId" = '20260418142729_init') THEN
    CREATE TABLE post."Posts" (
        "Id" uuid NOT NULL,
        "AuthorUserId" uuid NOT NULL,
        "Title" character varying(180) NOT NULL,
        "Excerpt" character varying(500) NOT NULL,
        "ContentMarkdown" text NOT NULL,
        "CoverImageUrl" character varying(500),
        "IsPublished" boolean NOT NULL,
        "IsDeleted" boolean NOT NULL,
        "PublishedAtUtc" timestamp with time zone,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Posts" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM post."__EFMigrationsHistory" WHERE "MigrationId" = '20260418142729_init') THEN
    CREATE INDEX "IX_Posts_AuthorUserId" ON post."Posts" ("AuthorUserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM post."__EFMigrationsHistory" WHERE "MigrationId" = '20260418142729_init') THEN
    INSERT INTO post."__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260418142729_init', '10.0.5');
    END IF;
END $EF$;
COMMIT;

