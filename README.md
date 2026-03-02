# SOA Express Boilerplate with Better Auth

A production-ready **Service-Oriented Architecture** boilerplate built with Express.js, featuring modern authentication with Better Auth, Drizzle ORM, PostgreSQL, Redis, and React 19 + Vite frontend.

## 🏗️ Architecture

```
soa-express-better-auth/
├── services/
│   ├── user-service/       # Port 3001 - Authentication & User Management
│   ├── product-service/    # Port 3002 - Product Catalog & Inventory
│   ├── order-service/      # Port 3003 - Order Processing
│   └── admin-service/      # Port 3004 - Admin Dashboard
├── gateway/               # Port 3000 - API Gateway
├── frontend/              # Port 5173 - React + Vite
├── shared/
│   ├── types/             # Shared TypeScript Types
│   ├── utils/             # Shared Utilities
│   └── drizzle/           # Database Schemas
└── docker-compose.yml
```

## 🎯 Features

- **Modern Authentication** - Better Auth with sessions, OAuth, 2FA, email verification
- **Type-Safe Database** - Drizzle ORM with TypeScript
- **PostgreSQL + Redis** - Reliable data storage and caching
- **Full TypeScript** - Complete type safety across all services
- **Service Communication** - REST API with proper error handling
- **Health Checks** - `/health` endpoints on all services
- **Zod Validation** - Request/response validation schemas

## 🚀 Quick Start

### 1. Clone and setup

```bash
cp .env.example .env
```

### 2. Start infrastructure

```bash
make up
```

### 3. Run migrations

```bash
make db:migrate
```

### 4. Start development

```bash
make dev
```

## 📦 Services

| Service | Port | Description |
|---------|------|-------------|
| Gateway | 3000 | API Gateway |
| User Service | 3001 | Auth & User Management |
| Product Service | 3002 | Products & Categories |
| Order Service | 3003 | Orders |
| Admin Service | 3004 | Admin Dashboard |
| Frontend | 5173 | React + Vite |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |

## 📝 Available Scripts

```bash
make dev              # Start all services
make dev:gateway      # Start gateway only
make dev:user         # Start user service
make dev:product      # Start product service
make dev:order        # Start order service
make up               # Start Docker Compose
make down             # Stop Docker Compose
make db:generate      # Generate migrations
make db:migrate       # Apply migrations
make db:studio        # Open Drizzle Studio
make logs             # View logs
```

## 🐳 Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

## 📁 Project Structure

```
services/
├── user-service/       Auth & Users
├── product-service/    Products
├── order-service/      Orders
└── admin-service/      Admin Dashboard

gateway/               API Gateway
frontend/              React + Vite
shared/
├── types/             TypeScript Types
├── utils/             Utilities
└── drizzle/           Database Schemas
```

## 🔒 Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `AUTH_SECRET` - Better Auth secret key

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Get running quickly
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment

**License:** MIT
