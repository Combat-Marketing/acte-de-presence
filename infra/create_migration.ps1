# run_migrations.ps1
# Run migrations for all or specific services

param(
    [Parameter(Position=0)]
    [string]$service = ""
)
param (
    [Parameter(Position=1)]
    [string]$name = ""
)

if ($service -eq "" -and $name -eq "") {
    # Run migration for specific service
    docker compose --profile migrations run atlas migrate diff $name --env development `
        --dir file:///migrations/$service-service/migrations `
        --url postgres://postgres:postgres@postgres:5432/$service`?sslmode=disable
}