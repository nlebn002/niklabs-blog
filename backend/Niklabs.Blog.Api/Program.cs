using Niklabs.Blog.Api.Endpoints;
using Niklabs.Blog.Application.DependencyInjection;
using Niklabs.Blog.Infrastructure.DependencyInjection;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddOpenApi();
builder.Services.AddBlogApplication();
builder.Services.AddBlogInfrastructure(builder.Configuration);

var app = builder.Build();

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

PostEndpoints.Map(app);

app.Run();
