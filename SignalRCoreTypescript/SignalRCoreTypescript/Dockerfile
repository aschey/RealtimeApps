FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["SignalRCoreTypescript/SignalRCoreTypescript.csproj", "SignalRCoreTypescript/"]
RUN dotnet restore "SignalRCoreTypescript/SignalRCoreTypescript.csproj"
COPY . .
WORKDIR "/src/SignalRCoreTypescript"
RUN dotnet build "SignalRCoreTypescript.csproj" -c Release -o /app

FROM node:12.0 AS node-build
COPY --from=build /src /src
WORKDIR /src/SignalRCoreTypescript
RUN npm run release

FROM build AS publish
RUN dotnet publish "SignalRCoreTypescript.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
COPY --from=node-build /src/SignalRCoreTypescript/wwwroot ./wwwroot
ENTRYPOINT ["dotnet", "SignalRCoreTypescript.dll"]