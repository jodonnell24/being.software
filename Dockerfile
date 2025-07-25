# Multi-stage production Dockerfile
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM golang:1.21-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

# Copy backend binary
COPY --from=backend-builder /app/backend/app .

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./web

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./app"]
