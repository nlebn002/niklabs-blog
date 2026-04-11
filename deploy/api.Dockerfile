FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore src/Modules/Blog/Niklabs.Blog.Api/Niklabs.Blog.Api.csproj
RUN dotnet publish src/Modules/Blog/Niklabs.Blog.Api/Niklabs.Blog.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

RUN mkdir -p /app/uploads

ENTRYPOINT ["dotnet", "Niklabs.Blog.Api.dll"]
