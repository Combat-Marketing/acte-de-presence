FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy shared library from monorepo root
COPY libs/go/consul ../libs/go/consul

# Copy microservice Go module files
COPY apps/microservices/settings-service/go.mod apps/microservices/settings-service/go.sum ./

# Adjust Go module replace directive
RUN go mod edit -replace acp/libs/consul=../libs/go/consul
RUN go mod tidy

# Copy service code
COPY apps/microservices/settings-service ./

RUN go build -o app ./cmd/main.go

FROM alpine:latest
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/app /app/app

EXPOSE 5004
CMD ["/app/app"]
