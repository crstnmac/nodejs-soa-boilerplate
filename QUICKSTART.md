# Quick Start

Get your SOA application running in under 5 minutes.

## Prerequisites

- **Docker & Docker Compose**
- **Node.js 20+** (for local development)

## Setup

```bash
# Copy environment template
cp .env.example .env
```

## Start Infrastructure

```bash
docker-compose up -d postgres redis
```

## Run Migrations

```bash
make db:migrate
```

## Start Development

```bash
make dev
```

## Verify

```bash
curl http://localhost:3000/health
```

## Access

- Frontend: http://localhost:5173
- Gateway: http://localhost:3000

## Useful Commands

```bash
make dev              # Start all services
make up               # Start Docker
make down             # Stop Docker
make db:studio        # Open Drizzle Studio
make logs             # View logs
```
