# Multi-stage build for backend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Security scan with Trivy (commented as this would be run in CI pipeline)
# RUN trivy filesystem --exit-code 1 --severity HIGH,CRITICAL .

# Production stage
FROM node:18-alpine

# Add Tini for proper signal handling
RUN apk add --no-cache tini

# Create non-root user
RUN addgroup -g 1001 nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

# Set working directory and copy from builder
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .

# Install Prometheus client for metrics
RUN npm install prom-client

# Expose ports
EXPOSE 5000
EXPOSE 9090

# Use tini as entrypoint to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Switch to non-root user
USER nodejs

# Start the application
CMD ["node", "src/server.js"]