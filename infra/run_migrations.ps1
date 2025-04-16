# run_migrations.ps1
# Run migrations for all or specific services

param(
    [Parameter(Position=0)]
    [string]$service = ""
)

if ($service -eq "all") {
    docker compose --profile migrations run atlas migrate apply `
        --dir file:///migrations/auth-service/migrations `
        --url postgres://postgres:postgres@postgres:5432/auth?sslmode=disable

    docker compose --profile migrations run atlas migrate apply `
        --dir file:///migrations/documents-service/migrations `
        --url postgres://postgres:postgres@postgres:5432/documents?sslmode=disable

    docker compose --profile migrations run atlas migrate apply `
        --dir file:///migrations/settings-service/migrations `
        --url postgres://postgres:postgres@postgres:5432/settings?sslmode=disable

    # Add other services as needed
}
else {
    # Run migration for specific service
    docker compose --profile migrations run atlas migrate apply `
        --dir file:///migrations/$service-service/migrations `
        --url postgres://postgres:postgres@postgres:5432/$service`?sslmode=disable
}