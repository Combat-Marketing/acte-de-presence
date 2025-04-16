#!/bin/bash
# Run migrations for all or specific services

if [ "$1" == "all" ]; then
  docker compose --profile migrations run atlas atlas migrate apply \
    --dir file:///migrations/auth-service/migrations \
    --url postgres://postgres:postgres@postgres:5432/auth?sslmode=disable

  docker compose --profile migrations run atlas atlas migrate apply \
    --dir file:///migrations/documents-service/migrations \
    --url postgres://postgres:postgres@postgres:5432/documents?sslmode=disable

  docker compose --profile migrations run atlas atlas migrate apply \
    --dir file:///migrations/settings-service/migrations \
    --url postgres://postgres:postgres@postgres:5432/settings?sslmode=disable

  # Add other services as needed
else
  # Run migration for specific service
  docker compose --profile migrations run atlas atlas migrate apply \
    --dir file:///migrations/$1-service/migrations \
    --url postgres://postgres:postgres@postgres:5432/$1?sslmode=disable
fi