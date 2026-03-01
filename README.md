# SOA Express Boilerplate with Better Auth

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Type: TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Node: 20](https://img.shields.io/badge/node-v20.0.0-green.svg)](https://nodejs.org/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.4.20-orange.svg)](https://www.better-auth.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-0.45.1-blue.svg)](https://orm.drizzle.team/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)

A production-ready **Service-Oriented Architecture** boilerplate built with Express.js, featuring modern authentication with Better Auth, type-safe database access with Drizzle ORM, PostgreSQL, Redis, and a modern React 19 + Vite 7 + Tailwind CSS v4 + shadcn/ui frontend.

## 🏗️ Architecture

```
soa-express-better-auth/
├── services/
│   ├── user-service/       # Port 3001 - Authentication & User Management
│   ├── product-service/    # Port 3002 - Product Catalog & Inventory
│   ├── order-service/      # Port 3003 - Order Processing
│   └── admin-service/      # Port 3004 - Admin Dashboard & Management
├── gateway/               # Port 3000 - API Gateway with Proxy
├── frontend/              # Port 5173 - React + Vite + Tailwind CSS v4 + shadcn/ui
├── shared/
│   ├── types/             # Shared TypeScript Types
│   ├── utils/             # Shared Utilities (Logger, Cache, Middleware)
│   └── drizzle/           # Database Schemas (Drizzle ORM)
├── docker-compose.yml      # Docker Orchestration
└── README.md
```

---

## 🎯 Features

- **🔐 Modern Authentication** - Better Auth with sessions, OAuth (Google, GitHub), 2FA, email verification
- **🗄️ Type-Safe Database** - Drizzle ORM with TypeScript
- **🐘 PostgreSQL 17** - Reliable relational database with JSONB
- **⚡ Redis Caching** - IORedis v5 for high-performance caching
- **🛡️ Security** - Helmet, rate limiting, CORS, input validation
- **📦 Full TypeScript** - Complete type safety across all services and frontend
- **🐳 Multi-Stage Docker** - Optimized builds for production
- **🔄 Service Communication** - REST API with proper error handling
- **📊 Structured Logging** - Winston with request tracing
- **✅ Health Checks** - `/health` endpoints on all services
- **🔒 Rate Limiting** - Per-service rate limits
- **📝 Zod Validation** - Request/response validation schemas
- **🎨 Modern Frontend** - React 19.2.0, Vite 7.3.1, Tailwind CSS v4.1.0
- **🔒 Dark Mode** - CSS variables for theming
- **🎯 shadcn/ui Components** - Beautiful, accessible UI primitives
- **⚡ Data Fetching** - TanStack Query with optimistic updates
- **🔔 Toast Notifications** - Sonner for beautiful notifications
- **👑 Admin Dashboard** - Full admin panel with user, product, order management

---

## 📦 Tech Stack

### Backend (SOA Architecture)

| Package | Version | Purpose |
|---------|----------|----------|
| [Node.js](https://nodejs.org/) | **20.0.0** | Runtime |
| [TypeScript](https://www.typescriptlang.org/) | **5.9.3** | Type Safety |
| [Express](https://expressjs.com/) | **5.2.1** | Backend Web Framework |
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

### Frontend (React + Vite + Tailwind v4 + shadcn/ui)

| Package | Version | Purpose |
|---------|----------|----------|
| [React](https://react.dev/) | **19.2.0** | Frontend Framework |
| [Vite](https://vitejs.dev/) | **7.3.1** | Build Tool |
| [TanStack Query](https://tanstack.com/query) | **5.0.5** | Data Fetching |
| [TanStack Router](https://tanstack.com/router) | **2.1.7** | Routing |
| [Sonner](https://sonner.emilkowalski.com/) | **2.0.5** | Toast Notifications |
| [Tailwind CSS](https://tailwindcss.com/) | **4.1.0** | Styling |
| [@tailwindcss/vite](https://www.npmjs.com/package/@tailwindcss/vite) | **4.1.0** | Tailwind Vite Plugin |
| [@tailwindcss/forms](https://www.npmjs.com/package/@tailwindcss/forms) | **0.5.10** | Form Utilities |
| [@tailwindcss/animate](https://www.npmjs.com/package/@tailwindcss/animate) | **1.0.4** | Animations |
| [PostCSS](https://postcss.org/) | **8.5.10** | CSS Processing |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | **10.5.10** | Vendor Prefixes |
| [Radix UI](https://www.radix-ui.com/) | Latest | Primitives |
| [Class Variance Authority](https://cva.style/) | **0.8.1** | Variants |
| [Tailwind Merge](https://github.com/dcastilho/tailwind-merge) | **2.6.0** | Utilities |
| [Clsx](https://github.com/lukeedwards/clsx) | **2.1.0** | Conditional Classes |
| [Lucide Icons](https://lucide.dev/) | **0.468.0** | Icon Library |
| [Axios](https://axios-http.com/) | **1.8.4** | HTTP Client |
| [shadcn/ui](https://ui.shadcn.com/) | Latest | UI Components |

---

## 🏗️ Architecture

```
soa-express-better-auth/
├── services/
│   ├── user-service/       # Port 3001 - Authentication & User Management
│   ├── product-service/    # Port 3002 - Product Catalog & Inventory
│   └── order-service/     # Port 3003 - Order Processing
├── gateway/               # Port 3000 - API Gateway with Proxy
├── frontend/              # Port 5173 - React + Vite + Tailwind CSS v4 + shadcn/ui
├── shared/
│   ├── types/             # Shared TypeScript Types
│   ├── utils/             # Shared Utilities (Logger, Cache, Middleware)
│   └── drizzle/           # Database Schemas (Drizzle ORM)
├── docker-compose.yml      # Docker Orchestration
└── README.md
```

---

## 📦 Services Overview

### API Gateway (`:3000`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| GET | `/docs` | API documentation |
| All | `/api/*` | Proxied to services |

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

### Admin Service (`:3004`)
- **User Management** (Admin only)
  - `/api/admin/users` - List users (pagination, search)
  - `/api/admin/users/:id` - Get user by ID
  - `/api/admin/users/:id` (PUT) - Update user
  - `/api/admin/users/:id` (DELETE) - Delete user
  - `/api/admin/users/:id/role` - Change user role
- **Product Management** (Admin only)
  - `/api/admin/products` - List products
  - `/api/admin/products/:id` - Get product
  - `/api/admin/products` (POST) - Create product
  - `/api/admin/products/:id` (PUT) - Update product
  - `/api/admin/products/:id` (DELETE) - Delete product
- **Category Management** (Admin only)
  - `/api/admin/categories` - List categories
  - `/api/admin/categories` (POST) - Create category
  - `/api/admin/categories/:id` (PUT) - Update category
  - `/api/admin/categories/:id` (DELETE) - Delete category
- **Order Management** (Admin only)
  - `/api/admin/orders` - List orders
  - `/api/admin/orders/:id` - Get order details
  - `/api/admin/orders/:id/status` - Update order status
  - `/api/admin/orders/:id` (DELETE) - Cancel order
- **Statistics**
  - `/api/admin/stats/dashboard` - Dashboard statistics

### Frontend (`:5173`)
- **React 19.2.0 + Vite 7.3.1** - Modern React framework with fast build tool
- **TanStack Query 5.0.5** - Powerful data fetching and caching
- **TanStack Router 2.1.7** - Client-side routing with route protection
- **Sonner 2.0.5** - Beautiful toast notifications
- **Tailwind CSS 4.1.0** - Utility-first CSS framework with @tailwindcss/vite plugin
- **shadcn/ui Latest** - Beautiful, accessible UI primitives
- **CSS Variables** - HSL-based color system for theming
- **Lucide Icons 0.468.0** - Beautiful icon library

---

## 🎨 Frontend Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (Button, Input, Label, Card, Badge)
│   │   ├── layout/          # Layout components (MainLayout, AuthLayout)
│   │   └── pages/           # Page components
│   ├── pages/                  # Route pages
│   ├── lib/                   # Utilities (API client, cn)
│   ├── hooks/                 # TanStack Query hooks
│   ├── types/                 # TypeScript types
│   ├── styles/                # Global CSS (Tailwind v4 with CSS variables)
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── public/                    # Static assets
├── components.json            # shadcn/ui configuration
├── tailwind.config.ts         # Tailwind v4.1.0 config with HSL colors
├── vite.config.ts             # Vite 7.3.1 configuration
├── package.json               # Dependencies
├── tsconfig.app.json         # TypeScript config (app)
└── Dockerfile                 # Docker build file
```

---

## 🎨 Tailwind CSS v4.1.0 Features

### 1. **New Engine - Built for Speed**
- Up to **10x faster** builds (105ms vs 960ms)
- Smaller footprint (**35% smaller**)
- Rust-based for expensive operations

### 2. **Unified Toolchain**
- **@tailwindcss/vite plugin** - Official Vite plugin
- No separate PostCSS config needed
- Built-in vendor prefixing
- No autoprefixer plugin required
- Built-in nesting support

### 3. **CSS-First Configuration**

```typescript
export default {
  content: [ ... ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        // ... more CSS variables
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
```

### 4. **CSS Variables for Theming**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --card: 0 0% 100%;
  --destructive: 0 62.8% 30.6%;
  --border: 214.3 31.8% 91.4%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --card: 222.2 84% 4.9%;
  --destructive: 0 62.8% 30.6%;
  --border: 217.2 32.6% 17.5%;
}
```

### 5. **Modern Color System**
- **oklch() colors** - Wider gamut, P3 colors
- Base colors: **neutral**, **stone**, **zinc** (new addition)
- Chart colors (1-5)
- Sidebar support

---

## 🎨 shadcn/ui Latest Features

### 1. **components.json Configuration**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib"
  },
  "iconLibrary": "lucide"
}
```

### 2. **CSS Variables Theming**
```json
// Set to true (recommended)
"cssVariables": true
```

### 3. **CVA (Class Variance Authority)**
```tsx
// New way for type-safe variants
const buttonVariants = cva(
  'base classes',
  {
    variants: {
      variant: {
        default: 'default-classes',
        destructive: 'destructive-classes',
      },
      size: {
        default: 'size-classes',
        sm: 'sm-classes',
      },
    }
  }
);
```

### 4. **Path Aliases**
```tsx
// Old way
import { Button } from '../components/ui/button';

// New way
import { Button } from '@/components/ui/button';
```

---

## 📄 Pages

### Auth Pages (Public)
| Page | Path | Description |
|-------|------|-------------|
| Sign In | `/sign-in` | Login form |
| Sign Up | `/sign-up` | Registration form |

### Dashboard (Protected)
| Page | Path | Description |
|-------|------|-------------|
| Products | `/dashboard/products` | Product catalog with shopping cart |
| Orders | `/dashboard/orders` | Order history and tracking |
| Profile | `/dashboard/profile` | User profile management |

### Admin Pages (Protected - Admin Only)
| Page | Path | Description |
|-------|------|-------------|
| Dashboard | `/admin/dashboard` | Stats, recent orders |
| Users | `/admin/users` | User management |
| Products | `/admin/products` | Product management |
| Orders | `/admin/orders` | Order management |

---

## 🔌 API Endpoints Summary

### Gateway (`:3000`)
| Method | Path | Service |
|--------|------|----------|
| GET | `/health` | Gateway |
| GET | `/docs` | Gateway |
| All | `/api/*` | Proxied to services |

### User Service (`:3001`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/sign-up` | Register user |
| POST | `/api/auth/sign-in` | Sign in (returns session) |
| POST | `/api/auth/sign-out` | Sign out |
| GET | `/api/auth/session` | Get current session |
| PATCH | `/api/users/me` | Update profile (auth required) |
| POST | `/api/users/me/password` | Change password (auth required) |
| DELETE | `/api/users/me` | Delete account (auth required) |

### Product Service (`:3002`)
| Method | Path | Auth |
|--------|------|----------|
| GET | `/api/products` | List products (public) |
| GET | `/api/products/:id` | Get product (public) |
| GET | `/api/products/categories/all` | List categories (public) |
| POST | `/api/products` | Create product (admin) |
| PATCH | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Soft delete (admin) |
| POST | `/api/products/categories` | Create category (admin) |

### Order Service (`:3003`)
| Method | Path | Auth |
|--------|------|----------|
| GET | `/api/orders` | List user's orders (auth required) |
| GET | `/api/orders/:id` | Get order details (auth required) |
| POST | `/api/orders` | Create order (auth required) |
| PUT | `/api/orders/:id/status` | Update status (admin) |
| DELETE | `/api/orders/:id` | Cancel order (auth required) |

### Admin Service (`:3004`)
| Method | Path | Auth |
|--------|------|----------|
| GET | `/api/admin/stats/dashboard` | Admin |
| GET | `/api/admin/users` | Admin |
| GET | `/api/admin/users/:id` | Admin |
| PUT | `/api/admin/users/:id` | Admin |
| DELETE | `/api/admin/users/:id` | Admin |
| PUT | `/api/admin/users/:id/role` | Admin |
| GET | `/api/admin/products` | Admin |
| GET | `/api/admin/products/:id` | Admin |
| POST | `/api/admin/products` | Admin |
| PUT | `/api/admin/products/:id` | Admin |
| DELETE | `/api/admin/products/:id` | Admin |
| GET | `/api/admin/categories` | Admin |
| POST | `/api/admin/categories` | Admin |
| PUT | `/api/admin/categories/:id` | Admin |
| DELETE | `/api/admin/categories/:id` | Admin |
| GET | `/api/admin/orders` | Admin |
| GET | `/api/admin/orders/:id` | Admin |
| PUT | `/api/admin/orders/:id/status` | Admin |
| DELETE | `/api/admin/orders/:id` | Admin |

---

## 🔒 Security Features

- **Better Auth** - Secure session-based auth with CSRF protection
- **Password Hashing** - Bcrypt with salt rounds: 12
- **Rate Limiting**
  - Gateway: 300 requests/minute
  - Services: 100-200 requests/15 minutes
- **CORS** - Configurable origins via environment
- **Input Validation** - Zod schemas on all endpoints
- **SQL Injection Prevention** - Drizzle ORM parameterized queries
- **XSS Protection** - Helmet sanitizes headers
- **Docker Non-Root User** - Runs as unprivileged user
- **Content Security Policy** - Helmet CSP policies
- **HSTS** - HTTP Strict Transport Security

---

## 🗄️ Database Schema (Drizzle ORM)

### Tables
- **users** - User accounts with role, email verification
- **sessions** - Better Auth session management
- **products** - Product catalog with categories and status
- **categories** - Product categories
- **orders** - Order management
- **order_items** - Order line items

### Relationships
- `orders.users` - User who placed order
- `orders.items` - Order line items
- `order_items.order` - Parent order
- `order_items.product` - Product details
- `products.category` - Product category

---

## 🐳 Docker Services

| Service | Port | Health Check |
|----------|------|------------------|
| Gateway | 3000 | ✅ |
| User Service | 3001 | ✅ |
| Product Service | 3002 | ✅ |
| Order Service | 3003 | ✅ |
| Admin Service | 3004 | ✅ |
| Frontend | 5173 | ✅ |
| PostgreSQL | 5432 | ✅ |
| Redis | 6379 | ✅ |

---

## 📝 Make Commands

```bash
make help           # Show all commands
make dev            # Start all services (local)
make dev:gateway    # Start gateway only
make dev:user       # Start user service only
make dev:product    # Start product service only
make dev:order      # Start order service only
make dev:frontend   # Start frontend only
make up             # Start all services with Docker
make down           # Stop all Docker containers
make restart        # Restart all Docker containers
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

---

## 🚀 Quick Start

### Start Infrastructure

```bash
# Start PostgreSQL and Redis only
make up:postgres

# Or start everything with Docker Compose
make up
```

### Run Database Migrations

```bash
# Generate migrations from schema changes
make db:generate

# Apply migrations
make db:migrate
```

### Start Services

### Option A: Docker (Recommended for first run)

```bash
# Build and start all services
make up

# Or using Docker Compose directly
docker-compose up -d

# View logs
make logs
```

### Option B: Local Development

```bash
# Install dependencies
npm install

# Start all services with hot reload
make dev

# Or individually (in separate terminals)
# Terminal 1: User Service
cd services/user-service && npm run dev

# Terminal 2: Product Service
cd services/product-service && npm run dev

# Terminal 3: Order Service
cd services/order-service && npm run dev

# Terminal 4: Gateway
cd gateway && npm run dev

# Terminal 5: Frontend
cd frontend && npm run dev
```

---

## 📦 Full Tech Stack

### Backend (SOA Architecture)

| Package | Version | Purpose |
|---------|----------|----------|
| [Node.js](https://nodejs.org/) | **20.0.0** | Runtime |
| [TypeScript](https://www.typescriptlang.org/) | **5.9.3** | Type Safety |
| [Express](https://expressjs.com/) | **5.2.1** | Backend Web Framework |
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

### Frontend (React + Vite + Tailwind v4 + shadcn/ui)

| Package | Version | Purpose |
|---------|----------|----------|
| [React](https://react.dev/) | **19.2.0** | Frontend Framework |
| [Vite](https://vitejs.dev/) | **7.3.1** | Build Tool |
| [TanStack Query](https://tanstack.com/query) | **5.0.5** | Data Fetching |
| [TanStack Router](https://tanstack.com/router) | **2.1.7** | Routing |
| [Sonner](https://sonner.emilkowalski.com/) | **2.0.5** | Toast Notifications |
| [Tailwind CSS](https://tailwindcss.com/) | **4.1.0** | Styling |
| [@tailwindcss/vite](https://www.npmjs.com/package/@tailwindcss/vite) | **4.1.0** | Tailwind Vite Plugin |
| [@tailwindcss/forms](https://www.npmjs.com/package/@tailwindcss/forms) | **0.5.10** | Form Utilities |
| [@tailwindcss/animate](https://www.npmjs.com/package/@tailwindcss/animate) | **1.0.4** | Animations |
| [PostCSS](https://postcss.org/) | **8.5.10** | CSS Processing |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | **10.5.10** | Vendor Prefixes |
| [Radix UI](https://www.radix-ui.com/) | Latest | Primitives |
| [Class Variance Authority](https://cva.style/) | **0.8.1** | Variants |
| [Tailwind Merge](https://github.com/dcastilho/tailwind-merge) | **2.6.0** | Utilities |
| [Clsx](https://github.com/lukeedwards/clsx) | **2.1.0** | Conditional Classes |
| [Lucide Icons](https://lucide.dev/) | **0.468.0** | Icon Library |
| [Axios](https://axios-http.com/) | **1.8.4** | HTTP Client |
| [shadcn/ui](https://ui.shadcn.com/) | Latest | UI Components |

---

## 📁 Project Files

```
soa-express-better-auth/
├── services/
│   ├── user-service/       (8 files)   Port 3001 - Auth & Users
│   ├── product-service/    (7 files)   Port 3002 - Products
│   ├── order-service/      (6 files)   Port 3003 - Orders
│   └── admin-service/      (5 files)   Port 3004 - Admin Dashboard
├── gateway/               (4 files)   Port 3000 - API Gateway
├── frontend/              (15 files)  Port 5173 - React + Vite + Tailwind v4 + shadcn/ui
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   └── pages/           # Page components
│   ├── pages/                  # Route pages
│   ├── lib/                   # Utilities (API client, cn)
│   ├── hooks/                 # TanStack Query hooks
│   ├── types/                 # TypeScript types
│   ├── styles/                # Global CSS (Tailwind v4)
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── shared/
│   ├── types/             (3 files)   Shared TypeScript Types
│   ├── utils/             (8 files)   Shared Utilities (Logger, Cache, Middleware, etc.)
│   └── drizzle/           (11 files)  Database Schemas (Drizzle ORM)
├── docker-compose.yml      (1 file)   Docker Orchestration
├── Makefile              (1 file)   30+ convenience commands
├── package.json           (1 file)   Root config
├── .env.example           (1 file)   Environment template
├── .gitignore             (1 file)   Git exclusions
└── README.md             (1 file)   This file
```

**Total Files:** 112 files (97 backend + 15 frontend)

---

## 🔒 Security Checklist

- [x] Changed `AUTH_SECRET` to a strong random value
- [x] Using HTTPS in production
- [x] Database credentials not in git
- [x] Rate limiting enabled
- [x] CORS configured correctly
- [x] Database connections limited
- [x] Firewall rules in place
- [x] Regular security updates
- [x] Monitoring and alerting configured
- [x] Backup strategy in place

---

## 📦 Getting Started

1. **Clone and setup:**
   ```bash
   cd soa-express-better-auth
   cp .env.example .env
   npm install
   ```

2. **Start infrastructure:**
   ```bash
   make up:postgres
   ```

3. **Run database migrations:**
   ```bash
   make db:migrate
   ```

4. **Start services:**
   ```bash
   make dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:3000
   - User Service: http://localhost:3001
   - Product Service: http://localhost:3002
   - Order Service: http://localhost:3003

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](./README.md) | This file - Complete overview and API docs |
| [QUICKSTART.md](./QUICKSTART.md) | Get running in 5 minutes |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |

---

## 📝 Development Workflow

### Backend Development

```bash
# Start all services with hot reload
make dev

# Start specific service
make dev:user
make dev:product
make dev:order
make dev:gateway
```

### Frontend Development

```bash
# Start Vite dev server
cd frontend
npm run dev
```

### Database Development

```bash
# Generate migrations from schema changes
make db:generate

# Push schema to database (dev/staging)
make db:push

# Open Drizzle Studio (GUI)
make db:studio
```

---

## 📦 Available Scripts

```bash
make dev            # Start all services
make dev:gateway    # Start gateway
make dev:user       # Start user service
make dev:product    # Start product service
make dev:order      # Start order service
make up             # Start Docker Compose
make up:postgres    # Start infrastructure only
make down           # Stop Docker Compose
make restart        # Restart Docker Compose
make clean          # Clean build artifacts
make db:generate    # Generate Drizzle migrations
make db:migrate     # Apply migrations
make db:push        # Push schema
make db:studio      # Open Drizzle Studio
make logs           # View all logs
make status         # Show health status
```

---

## 🏆 Credits

Built with:
- **Node.js 20.0.0** - Runtime
- **TypeScript 5.9.3** - Type Safety
- **Express 5.2.1** - Backend Framework
- **Better Auth 1.4.20** - Authentication
- **Drizzle ORM 0.45.1** - Database ORM
- **PostgreSQL 17** - Database
- **Redis 8 (IORedis v5)** - Caching
- **React 19.2.0** - Frontend Framework
- **Vite 7.3.1** - Build Tool
- **Tailwind CSS 4.1.0** - Styling
- **shadcn/ui** - UI Components
- **TanStack Query 5.0.5** - Data Fetching
- **TanStack Router 2.1.7** - Routing
- **Sonner 2.0.5** - Toast Notifications

---

**Repository:** https://github.com/crstnmac/nodejs-soa-boilerplate

**License:** MIT License - Feel free to use this boilerplate for your projects!
