FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["SignalRAPI/SignalRAPI.csproj", "SignalRAPI/"]
RUN dotnet restore "SignalRAPI/SignalRAPI.csproj"
COPY . .
WORKDIR "/src/SignalRAPI"
RUN dotnet build "SignalRAPI.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "SignalRAPI.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "SignalRAPI.dll"]