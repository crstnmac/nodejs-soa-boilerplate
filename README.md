# SOA Express Boilerplate with Better Auth

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Type: TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-blue.svg)](https://www.typescriptlang.org/)
[![Node: 20](https://img.shields.io/badge/node-v20.0.0-green.svg)](https://nodejs.org/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.4.20-orange.svg)](https://www.better-auth.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-0.45.1-blue.svg)](https://orm.drizzle.team/)

A production-ready **Service-Oriented Architecture** boilerplate built with Express.js, featuring modern authentication with Better Auth, type-safe database access with Drizzle ORM, and PostgreSQL.

## 🏗️ Architecture

```
soa-express-better-auth/
├── services/
│   ├── user-service/       # Port 3001 - Authentication & User Management
│   ├── product-service/    # Port 3002 - Product Catalog & Inventory
│   └── order-service/     # Port 3003 - Order Processing
├── gateway/               # Port 3000 - API Gateway with Proxy
├── shared/
│   ├── types/             # Shared TypeScript Types
│   ├── utils/             # Shared Utilities (Logger, Cache, Middleware)
│   └── drizzle/           # Database Schemas (Drizzle ORM)
├── docker-compose.yml      # Docker Orchestration
└── README.md
```

## 🚀 Features

- **🔐 Modern Authentication** - Better Auth with sessions, OAuth (Google, GitHub), 2FA, email verification
- **🗄️ Type-Safe Database** - Drizzle ORM with TypeScript
- **🐘 PostgreSQL 17** - Reliable relational database with JSONB
- **⚡ Redis Caching** - IORedis v5 for high-performance caching
- **🛡️ Security** - Helmet, rate limiting, CORS, input validation
- **📦 Full TypeScript** - Complete type safety across all services
- **🐳 Multi-Stage Docker** - Optimized builds for production
- **🔄 Service Communication** - REST API with proper error handling
- **📊 Structured Logging** - Winston with request tracing
- **✅ Health Checks** - `/health` endpoints on all services
- **🔒 Rate Limiting** - Per-service rate limits
- **📝 Zod Validation** - Request/response validation schemas

## 📦 Tech Stack (Latest as of 2026)

| Package | Version | Purpose |
|---------|----------|----------|
| [Node.js](https://nodejs.org/) | **20.0.0** | Runtime |
| [TypeScript](https://www.typescriptlang.org/) | **5.8.0** | Type Safety |
| [Express](https://expressjs.com/) | **5.2.1** | Web Framework |
| [Better Auth](https://www.better-auth.com/) | **1.4.20** | Authentication |
| [Drizzle ORM](https://orm.drizzle.team/) | **0.45.1** | Database ORM |
| [Drizzle Kit](https://kit.drizzle.team/) | **0.31.5** | CLI Tool |
| [PostgreSQL](https://www.postgresql.org/) | **17** | Database |
| [Redis](https://redis.io/) | **8 (IORedis v5)** | Caching |
| [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) | **5.1.1** | Password Hashing |
| [Winston](https://github.com/winstonjs/winston) | **3.19.0** | Logging |
| [Morgan](https://github.com/expressjs/morgan) | **1.10.1** | HTTP Request Logging |
| [Zod](https://github.com/colinhacks/zod) | **4.3.6** | Validation |
| [Helmet](https://helmetjs.github.io/) | **8.0.0** | Security Headers |
| [Express Rate Limit](https://github.com/nfriedly/express-rate-limit) | **7.5.0** | Rate Limiting |
| [Nanoid](https://github.com/ai/nanoid) | **5.0.9** | Secure ID Generation |
| [ioredis](https://github.com/luin/ioredis) | **5.10.0** | Redis Client |

## 📁 Services Overview

### API Gateway (`:3000`)
- Single entry point for all requests
- Routes requests to appropriate microservices
- CORS, rate limiting, security headers
- Health check endpoint

### User Service (`:3001`)
- **Better Auth Integration** (Full)
  - Email/Password authentication
  - Social OAuth (Google, GitHub)
  - Session management with Redis
  - Email verification
  - Password reset
- **User Management**
  - Get current user profile
  - Update profile (name, email)
  - Change password
  - Delete account (deactivate)
- **Protected Routes**
  - `/api/users/me` - Get profile
  - `/api/users/me` (PATCH) - Update profile
  - `/api/users/me/password` (POST) - Change password
  - `/api/users/me` (DELETE) - Delete account

### Product Service (`:3002`)
- **Public Routes**
  - `/api/products` - List products (pagination, search, filter)
  - `/api/products/:id` - Get product details
  - `/api/products/categories/all` - List all categories
- **Admin Routes** (Requires admin role)
  - `/api/products` (POST) - Create product
  - `/api/products/:id` (PATCH) - Update product
  - `/api/products/:id` (DELETE) - Soft delete product
  - `/api/products/categories` (POST) - Create category
- **Features**
  - Redis caching (5-min cache for lists, 30-min for products)
  - Search by name
  - Filter by category
  - Pagination support

### Order Service (`:3003`)
- **Protected Routes** (Requires authentication)
  - `/api/orders` - List user's orders (pagination)
  - `/api/orders/:id` - Get order details
  - `/api/orders` (POST) - Create order
- **Admin Routes**
  - `/api/orders/:id/status` (PUT) - Update order status
- **Features**
  - Product validation and stock check
  - Total price calculation
  - Order status tracking (pending → processing → shipped → delivered/cancelled)
  - Cancellation support (only pending/processing)

## 🗄️ Database Schema (Drizzle ORM)

### Tables
- **users** - User accounts with role, email verification
- **sessions** - Better Auth session management
- **products** - Product catalog with categories and status
- **categories** - Product categories
- **orders** - Order management
- **order_items** - Order line items

### Relationships
- `orders.users` - User who placed the order
- `orders.items` - Order line items
- `order_items.order` - Parent order
- `order_items.product` - Product details
- `products.category` - Product category

## 🔒 Security Features

- **Better Auth** - Secure session-based auth with CSRF protection
- **Password Hashing** - Bcrypt with salt rounds: 12
- **Rate Limiting**
  - Gateway: 300 requests/minute
  - Services: 100-200 requests/15 minutes
- **CORS** - Configurable origins via environment
- **Helmet** - Content Security Policy, HSTS, X-Frame-Options
- **Input Validation** - Zod schemas on all endpoints
- **SQL Injection Prevention** - Drizzle ORM parameterized queries
- **XSS Protection** - Helmet sanitizes headers

## 📊 API Response Format

```json
{
  "success": true|false,
  "data": {...},
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🐳 Docker Deployment

### Services
- **Gateway**: Node 20 Alpine, multi-stage build
- **User Service**: Node 20 Alpine, multi-stage build
- **Product Service**: Node 20 Alpine, multi-stage build
- **Order Service**: Node 20 Alpine, multi-stage build
- **PostgreSQL**: PostgreSQL 17 Alpine
- **Redis**: Redis 8 Alpine

### Health Checks
All services have `/health` endpoints with:
- Service status
- Version info
- Cache connection status
- Database status (on applicable)

## 🚀 Quick Start

```bash
# Clone and setup
cd soa-express-better-auth
cp .env.example .env

# Start infrastructure
docker-compose up postgres redis -d

# Run migrations
npm run db:migrate

# Start all services
make dev
```

Or using Docker Compose:
```bash
docker-compose up -d
```

## 📚 API Endpoints Summary

| Method | Path | Service | Description |
|--------|------|----------|-------------|
| POST | `/api/auth/sign-up` | User | Register new user |
| POST | `/api/auth/sign-in` | User | Sign in (returns session) |
| POST | `/api/auth/sign-out` | User | Sign out |
| GET | `/api/auth/session` | User | Get current session |
| GET | `/api/users/me` | User | Get profile (auth required) |
| PATCH | `/api/users/me` | User | Update profile (auth required) |
| DELETE | `/api/users/me` | User | Delete account (auth required) |
| POST | `/api/users/me/password` | User | Change password (auth required) |
| GET | `/api/products` | Product | List products (public, paginated) |
| GET | `/api/products/:id` | Product | Get product (public) |
| GET | `/api/products/categories/all` | Product | List categories (public) |
| POST | `/api/products` | Product | Create product (admin) |
| PATCH | `/api/products/:id` | Product | Update product (admin) |
| DELETE | `/api/products/:id` | Product | Soft delete (admin) |
| POST | `/api/products/categories` | Product | Create category (admin) |
| GET | `/api/orders` | Order | List user's orders (auth required, paginated) |
| GET | `/api/orders/:id` | Order | Get order details (auth required) |
| POST | `/api/orders` | Order | Create order (auth required) |
| PUT | `/api/orders/:id/status` | Order | Update status (admin) |
| DELETE | `/api/orders/:id` | Order | Cancel order (auth required) |
| GET | `/health` | All | Health check |

## 🔧 Environment Variables

```bash
# Server Configuration
NODE_ENV=development|production
PORT=3000

# Database (PostgreSQL 17)
DATABASE_URL=postgresql://user:password@localhost:5432/db_name

# Redis (IORedis v5)
REDIS_URL=redis://localhost:6379

# Better Auth
AUTH_SECRET=your-super-secret-auth-key-change-in-production-min-32-chars
AUTH_URL=http://localhost:3000/auth
BETTER_AUTH_ORIGIN=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-auth-key-change-in-production

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Service URLs
USER_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003

# Logging
LOG_LEVEL=info|debug|error
```

## 📝 Make Commands

```bash
make help           # Show all commands
make dev            # Start all services (local)
make dev:gateway    # Start gateway only
make dev:user       # Start user service only
make dev:product    # Start product service only
make dev:order      # Start order service only
make up             # Start Docker Compose
make down           # Stop Docker Compose
make restart        # Restart Docker Compose
make db:generate    # Generate Drizzle migrations
make db:migrate     # Apply Drizzle migrations
make db:studio      # Open Drizzle Studio
make logs           # View logs from all services
make logs:gateway  # View gateway logs
make logs:user      # View user service logs
make logs:product  # View product service logs
make logs:order      # View order service logs
make status         # Show health status
make clean          # Clean build artifacts
```

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get running in 5 minutes
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT License - Feel free to use this boilerplate for your projects!
