FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy shared library from monorepo root
COPY libs/go/consul ../libs/go/consul

# Copy microservice Go module files
COPY apps/microservices/websites-service/go.mod apps/microservices/websites-service/go.sum ./

# Adjust Go module replace directive
RUN go mod edit -replace acp/libs/consul=../libs/go/consul
RUN go mod tidy

# Copy service code
COPY apps/microservices/websites-service ./

# Build main application
RUN go build -o app ./cmd/main.go

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy binaries from builder
COPY --from=builder /app/app /app/app

# No need to run migrations again here since we already did it in the migration stage

EXPOSE 5003
CMD ["/app/app"]
