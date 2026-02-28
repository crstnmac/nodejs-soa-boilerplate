# Build stage
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npx tsc

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy production files
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output
COPY --from=base /app/dist ./dist

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Create non-root user for security
RUN addgroup -g node user && useradd -r -g node node
USER node

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "dist/index.js"]
