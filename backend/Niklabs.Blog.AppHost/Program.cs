using DotNetEnv;

Env.Load("../../.env");
var builder = DistributedApplication.CreateBuilder(args);

var pgConStr = builder.Configuration["ConnectionStrings:postgres"];
var objectStorageBucket = builder.Configuration["ObjectStorage:Bucket"] ?? "blog-media";
var objectStorageUseSsl = builder.Configuration["ObjectStorage:UseSsl"] ?? "false";
var objectStoragePublicBaseUrl = builder.Configuration["ObjectStorage:PublicBaseUrl"] ?? $"http://localhost:9000/{objectStorageBucket}";

builder.AddProject<Projects.Niklabs_Api>("api")
    .WithEnvironment("ConnectionStrings__postgres", pgConStr)
    .WithEnvironment("ObjectStorage__Endpoint", "localhost:9000")
    .WithEnvironment("ObjectStorage__AccessKey", builder.Configuration["ObjectStorage:AccessKey"] ?? "minioadmin")
    .WithEnvironment("ObjectStorage__SecretKey", builder.Configuration["ObjectStorage:SecretKey"] ?? "minioadmin")
    .WithEnvironment("ObjectStorage__Bucket", objectStorageBucket)
    .WithEnvironment("ObjectStorage__UseSsl", objectStorageUseSsl)
    .WithEnvironment("ObjectStorage__PublicBaseUrl", objectStoragePublicBaseUrl);

builder.Build().Run();

