# Quick Start Guide

Get your SOA application running in under 5 minutes.

## 🎯 Prerequisites

Make sure you have:
- **Docker & Docker Compose** (for easiest start)
- **Node.js 20+** (for local development)
- **pnpm or npm** (for dependency management)

## 📥 Step 1: Clone & Setup

```bash
# Navigate to project directory
cd /root/.openclaw/workspace/soa-express-better-auth

# Copy environment template
cp .env.example .env
```

## 🎚 Step 2: Start Infrastructure

```bash
# Start PostgreSQL and Redis only
docker-compose up postgres redis -d

# Or start everything (includes services)
docker-compose up -d
```

Wait for services to be healthy (~10 seconds).

## 🗄️ Step 3: Run Database Migrations

```bash
# Generate migrations from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate
```

## 🚀 Step 4: Start Services

### Option A: Docker (Recommended - Simple & Reliable)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option B: Local Development (Hot Reload)

```bash
# Install dependencies
npm install

# Start all services concurrently
npm run dev

# Or individually (in separate terminals)
cd services/user-service && npm run dev
cd services/product-service && npm run dev
cd services/order-service && npm run dev
cd gateway && npm run dev
```

## ✅ Step 5: Verify Everything Works

### Health Checks

```bash
# Gateway
curl http://localhost:3000/health

# User Service
curl http://localhost:3001/health

# Product Service
curl http://localhost:3002/health

# Order Service
curl http://localhost:3003/health

# Or use Make command
make status
```

### Test API Endpoints

```bash
# 1. Sign up a user
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123",
    "name": "Test User"
  }'

# 2. Sign in (returns session in cookies)
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }' \
  -c

# 3. List products (no auth required)
curl http://localhost:3000/api/products

# 4. Get current user (requires auth)
# First get the session cookie from sign-in response
curl http://localhost:3000/api/users/me \
  -H "Cookie: better-auth.session_id=your-session-cookie"

# 5. Create an order (requires auth)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_id=your-session-cookie" \
  -d '{
    "items": [
      { "productId": 1, "quantity": 2 }
    ]
  }'
```

## 🛠️ Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3000

# Or change PORT in .env
PORT=4000 npm run dev
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check DATABASE_URL
grep DATABASE_URL .env

# Test connection (requires psql in container)
docker-compose exec postgres psql -U soa_user -d soa_db -c "SELECT 1"
```

### Build Errors

```bash
# Clean and rebuild
make clean
make build
```

### Service Won't Start

```bash
# Check logs
make logs

# Check environment variables
docker-compose config

# Verify database connection
make psql
```

## 🔧 Useful Commands

```bash
# View logs
make logs                    # All services
make logs:gateway          # Gateway
make logs:user              # User Service
make logs:product           # Product Service
make logs:order             # Order Service

# Database operations
make db:generate            # Generate migrations
make db:migrate             # Apply migrations
make db:studio              # Open Drizzle Studio
make db:push                 # Push schema changes
make db:reset               # Reset database (WARNING: deletes all data)

# Development
make dev                    # Start all services
make dev:gateway            # Gateway
make dev:user               # User Service
make dev:product            # Product Service
make dev:order              # Order Service

# Docker operations
make up                     # Start Docker Compose
make down                   # Stop Docker Compose
make restart                # Restart Docker Compose
make status                 # Show health status
make clean                  # Clean build artifacts

# Connect to databases
make psql                    # PostgreSQL
make redis-cli              # Redis

# Testing
make test                   # Run tests

# Help
make help                   # Show all commands
```

## 📊 Project Structure

```
soa-express-better-auth/
├── services/
│   ├── user-service/       # Port 3001 - Auth & Users
│   ├── product-service/    # Port 3002 - Products
│   └── order-service/     # Port 3003 - Orders
├── gateway/               # Port 3000 - API Gateway
├── shared/
│   ├── types/             # TypeScript Types
│   ├── utils/             # Shared Utilities
│   └── drizzle/           # Database Schemas
├── docker-compose.yml      # Docker Orchestration
├── Makefile              # Convenience Commands
├── .env.example           # Environment Template
└── README.md             # This file
```

## 📚 Additional Resources

- **Full README:** [README.md](./README.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Better Auth Docs:** https://www.better-auth.com/
- **Drizzle Docs:** https://orm.drizzle.team/
- **Express Docs:** https://expressjs.com/

## 🚀 Next Steps

1. **Customize Schema** - Edit `shared/drizzle/src/schema/` files
2. **Add Business Logic** - Update controllers in `services/*/src/controllers/`
3. **Set up OAuth** - Configure Google/GitHub in `.env`
4. **Add Tests** - Write tests in each service
5. **Deploy** - Follow `DEPLOYMENT.md` for production setup

## 💡 Tips

- **Hot Reload:** When running `npm run dev`, changes to TypeScript files trigger automatic rebuild
- **Redis Cache:** Products are cached for 5 minutes after first access
- **Session Management:** Better Auth handles session cleanup automatically
- **Health Checks:** All services expose `/health` endpoint for monitoring
- **Log Levels:** Set `LOG_LEVEL=debug` in `.env` for verbose logging

Happy coding! 🎉
