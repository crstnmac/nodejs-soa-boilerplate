# Build stage
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source files
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY src ./src
COPY index.html ./index.html
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Install frontend dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-save

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy production files
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets
COPY --from=base /app/dist ./dist
COPY --from=base /app/index.html ./index.html

# Set environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g node user && useradd -r -g node node
USER node

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
