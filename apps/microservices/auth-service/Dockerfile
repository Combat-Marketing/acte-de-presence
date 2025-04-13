FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY libs/go/consul ../libs/go/consul
COPY apps/microservices/auth-service/go.mod apps/microservices/auth-service/go.sum ./

RUN go mod edit -replace github.com/your-org/consul=../libs/go/consul
RUN go mod tidy

COPY apps/microservices/auth-service ./

RUN go build -o app ./cmd/main.go

FROM alpine:latest
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/app /app/app

EXPOSE 5002
CMD ["/app/app"]
