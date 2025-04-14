FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy shared library from monorepo root
COPY libs/go/consul ../libs/go/consul

# Copy microservice Go module files
COPY apps/microservices/cms-service/go.mod apps/microservices/cms-service/go.sum ./

# Adjust Go module replace directive
RUN go mod edit -replace github.com/your-org/consul=../libs/go/consul
RUN go mod tidy

# Copy service code
COPY apps/microservices/cms-service ./

RUN go build -o app ./cmd/main.go

FROM alpine:latest
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/app /app/app

EXPOSE 5001
CMD ["/app/app"]
