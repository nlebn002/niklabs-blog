var builder = DistributedApplication.CreateBuilder(args);

var password = builder.AddParameter("postgres-password", secret: true);
var postgres = builder.AddPostgres("postgres", password)
    .WithDataVolume();

var blogDb = postgres.AddDatabase("blogdb");

builder.AddProject<Projects.Niklabs_Blog_Api>("api")
    .WithReference(blogDb)
    .WaitFor(blogDb);

builder.Build().Run();
