FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

FROM node:18-alpine
RUN apk add --no-cache tini
RUN addgroup -g 1001 nodejs && adduser -S -u 1001 -G nodejs nodejs
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
ENTRYPOINT ["/sbin/tini", "--"]
USER nodejs
EXPOSE 5002
CMD ["node", "src/server.js"]
