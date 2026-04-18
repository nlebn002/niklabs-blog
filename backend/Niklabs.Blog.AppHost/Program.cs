using DotNetEnv;

Env.Load("../../.env");
var builder = DistributedApplication.CreateBuilder(args);

var pgConStr = builder.Configuration["ConnectionStrings:postgres"];

builder.AddProject<Projects.Niklabs_Api>("api")
    .WithEnvironment("ConnectionStrings__postgres", pgConStr);

builder.Build().Run();

