# ASP.NET Core Template using Clean Architecture & Angular


### Run the API

(from App.API folder CLI)

```
dotnet run
```

### Run the SPA

(from App-SPA folder CLI)

```
npm install

ng serve
```


Note: If you need to create a migration, you can use this command:

```
-- create migration (from App.API folder CLI)
dotnet ef migrations add "InitialCreate" -p ../App.Infrastructure/App.Infrastructure.csproj -s App.API.csproj -o Persistence/Migrations
```

