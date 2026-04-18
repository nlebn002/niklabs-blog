using Niklabs.Blog.Api.Auth;
using Niklabs.Blog.Api.Endpoints.Auth;
using Niklabs.Blog.Api.Endpoints.Posts;
using Niklabs.Blog.Auth.Application.Handlers.GetCurrentUser;
using Niklabs.Blog.Auth.Application.Handlers.Login;
using Niklabs.Blog.Auth.Application.Handlers.Logout;
using Niklabs.Blog.Auth.Infrastructure.DependencyInjection;
using Niklabs.Blog.Application.Abstractions;
using Niklabs.Blog.Application.DependencyInjection;
using Niklabs.Blog.Infrastructure.DependencyInjection;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
});
builder.Services.AddScoped<ICurrentUser, HttpContextCurrentUser>();
builder.Services.AddScoped<LoginHandler>();
builder.Services.AddScoped<LogoutHandler>();
builder.Services.AddScoped<GetCurrentUserHandler>();
builder.Services.AddAuthInfrastructure(builder.Configuration);
builder.Services.AddBlogApplication();
builder.Services.AddBlogInfrastructure(builder.Configuration);
builder.Services.AddScoped<AntiforgeryValidationFilter>();

var app = builder.Build();

app.MapDefaultEndpoints();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

AuthEndpoints.Map(app);
PostEndpoints.Map(app);

app.Run();

public partial class Program;
