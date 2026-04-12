using DotNetEnv;

Env.Load("../../../.env");
var builder = DistributedApplication.CreateBuilder(args);


// read .env vars
var pgUser = builder.Configuration["POSTGRES_USER"];
var pgPass = builder.Configuration["POSTGRES_PASSWORD"];
var pgDb = builder.Configuration["POSTGRES_DB"];
var pgPort = builder.Configuration["POSTGRES_PORT"] ?? "5432";

var connectionString = $"Host=localhost;Port={pgPort};Database={pgDb};Username={pgUser};Password={pgPass}";
var postgres = builder.AddConnectionString("postgres", connectionString);

builder.AddProject<Projects.Niklabs_Blog_Api>("api");

builder.Build().Run();