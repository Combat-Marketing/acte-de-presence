# create_migration.ps1
# Create migrations for specific services

param(
    [Parameter(Position=0)]
    [string]$service = "",

    [Parameter(Position=1)]
    [string]$name = "",
    
    [string]$dbHost = "localhost"
)
Write-Output "Creating migration for service: $service with name: $name"

if ($service -ne "" -and $name -ne "") {
    # Run migration for specific service
    docker compose --profile migrations run --remove-orphans -- atlas migrate diff $name --env development `
        --dir file:///migrations/$service-service/migrations `
        --config file:///migrations/$service-service/atlas.hcl
} else {
    Write-Output "No service or name provided. Please provide a service or name to run migrations."
    exit 1
}
