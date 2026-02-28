# Deployment Guide

This guide covers deploying SOA Express boilerplate to production environments.

## 🎯 Prerequisites

- Docker & Docker Compose (for containerized deployment)
- PostgreSQL 17+ (managed or self-hosted)
- Redis 7+ (managed or self-hosted)
- Domain name with SSL (recommended for production)
- Node.js 20+ runtime

## 🔐 Security & Configuration

### Environment Variables

Copy `.env.example` to `.env` and update for production:

```bash
cp .env.example .env
nano .env  # or your preferred editor
```

### Critical Security Settings

**CHANGE THESE IN PRODUCTION:**

```bash
# Generate a secure random secret (32+ characters)
AUTH_SECRET=$(openssl rand -base64 32)

# Update DATABASE_URL with production credentials
DATABASE_URL=postgresql://user:password@your-db-host:5432/db_name

# Update Redis URL
REDIS_URL=redis://your-redis-host:6379

# Set production origins
BETTER_AUTH_ORIGIN=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Set NODE_ENV
NODE_ENV=production
```

## 🚀 Deployment Options

### Option 1: Docker Compose (VPS/Cloud)

**1. Clone and setup:**
```bash
git clone <your-repo>
cd soa-express-better-auth
cp .env.example .env
nano .env  # Update with production values
```

**2. Build and start:**
```bash
docker-compose build
docker-compose up -d
```

**3. Configure reverse proxy (Nginx):**

Nginx configuration example:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Gateway
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Services (optional, for direct access)
    location /api/ {
        # Or route to individual services:
        # location /api/users { proxy_pass http://localhost:3001; }
        # location /api/products { proxy_pass http://localhost:3002; }
        # location /api/orders { proxy_pass http://localhost:3003; }
    }
}
```

### Option 2: Docker Swarm / Kubernetes

**Docker Stack:**

```bash
docker stack deploy -c docker-compose.yml soa
```

**Kubernetes:**

Use the provided Dockerfiles to build images and deploy with Helm or Kustomize.

Kubernetes Deployment Manifests (example):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: soa-gateway
  labels:
    app: soa-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: soa-gateway
  template:
    metadata:
      labels:
        app: soa-gateway
    spec:
      containers:
      - name: gateway
        image: your-registry/soa-gateway:latest
        ports:
          - containerPort: 3000
        env:
          - name: NODE_ENV
            value: "production"
          - name: DATABASE_URL
            valueFrom:
              secretKeyRef: db-credentials
          - name: REDIS_URL
            valueFrom:
              secretKeyRef: redis-credentials
          - name: AUTH_SECRET
            valueFrom:
              secretKeyRef: auth-credentials
          - name: USER_SERVICE_URL
            value: http://user-service:3001
          - name: PRODUCT_SERVICE_URL
            value: http://product-service:3002
          - name: ORDER_SERVICE_URL
            value: http://order-service:3003
---
```

### Option 3: Individual Container Deployment

**Build each service:**
```bash
# Build gateway
docker build -t your-registry/gateway:latest ./gateway

# Build user service
docker build -t your-registry/user-service:latest ./services/user-service

# Build product service
docker build -t your-registry/product-service:latest ./services/product-service

# Build order service
docker build -t your-registry/order-service:latest ./services/order-service

# Push to registry
docker push your-registry/gateway:latest
docker push your-registry/user-service:latest
docker push your-registry/product-service:latest
docker push your-registry/order-service:latest
```

**Run on production server:**
```bash
# Gateway
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:password@db:5432/soa_db \
  -e REDIS_URL=redis://redis:6379 \
  your-registry/gateway:latest

# User Service
docker run -d -p 3001:3001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:password@db:5432/soa_db \
  -e REDIS_URL=redis://redis:6379 \
  -e AUTH_SECRET=your-super-secret \
  -e AUTH_URL=https://yourdomain.com/auth \
  -e BETTER_AUTH_ORIGIN=https://yourdomain.com \
  your-registry/user-service:latest

# Product Service
docker run -d -p 3002:3002 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:password@db:5432/soa_db \
  -e REDIS_URL=redis://redis:6379 \
  -e USER_SERVICE_URL=http://user-service:3001 \
  your-registry/product-service:latest

# Order Service
docker run -d -p 3003:3003 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:password@db:5432/soa_db \
  -e REDIS_URL=redis://redis:6379 \
  -e USER_SERVICE_URL=http://user-service:3001 \
  -e PRODUCT_SERVICE_URL=http://product-service:3002 \
  your-registry/order-service:latest
```

## 🗄️ Database Migrations

Run migrations on production:

```bash
# Generate migrations from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Or push schema directly (for dev/staging)
npm run db:push
```

## 📊 Monitoring

### Health Checks

All services have `/health` endpoints:

```bash
# Gateway
curl https://yourdomain.com/health
curl https://gateway.yourdomain.com/health

# User Service
curl https://user.yourdomain.com/health

# Product Service
curl https://product.yourdomain.com/health

# Order Service
curl https://order.yourdomain.com/health
```

### Structured Logging

View logs in real-time:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f gateway
docker-compose logs -f user-service
docker-compose logs -f product-service
docker-compose logs -f order-service
```

**For production, consider:**
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **CloudWatch** (AWS)
- **Datadog**
- **Grafana + Loki**
- **Sentry** (Error tracking)

## 🔒 Security Best Practices

- [ ] Changed `AUTH_SECRET` to a strong random value
- [ ] Using HTTPS in production
- [ ] Database credentials not in git
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Database connections limited
- [ ] Firewall rules in place
- [ ] Regular security updates
- [ ] Monitoring and alerting configured
- [ ] Backup strategy in place

## 💾 Backup Strategy

### Database Backup (PostgreSQL)

```bash
# Automated backup via cron job
0 2 * * * * * root docker exec soa-postgres pg_dump -U soa_user -d soa_db > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i soa-postgres psql -U soa_user -d soa_db < backup.sql
```

### Redis Backup

```bash
# Snapshot data
docker exec soa-redis redis-cli SAVE
docker cp soa-redis:/data/dump.rdb ./redis_backup/

# Restore
docker cp ./redis_backup/dump.rdb soa-redis:/data/dump.rdb
docker exec soa-redis redis-cli FLUSH
docker exec soa-redis redis-cli RESTORE dump.rdb
```

## 🔄 Rollback Procedure

To rollback to a previous version:

```bash
# Stop services
docker-compose down

# Checkout previous commit
git checkout <previous-commit>

# Rebuild and start
docker-compose build
docker-compose up -d

# Run migrations
npm run db:migrate
```

## 🛠️ Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs <service-name>

# Check environment variables
docker-compose config

# Check database connection
docker-compose exec postgres psql -U soa_user -d soa_db -c "SELECT 1"
```

### Database Connection Errors

```bash
# Test connection
docker-compose exec postgres pg_isready -U soa_user -d soa_db

# Check DATABASE_URL in .env
echo $DATABASE_URL

# Verify database is reachable
telnet localhost 5432
```

### Redis Connection Errors

```bash
# Test Redis
docker-compose exec redis redis-cli ping

# Check REDIS_URL in .env
echo $REDIS_URL
```

### Performance Issues

```bash
# Check Redis cache hit rate
# Look for cache logs in service output

# Monitor database query performance
# Enable slow query logging in PostgreSQL
docker-compose exec postgres psql -U soa_user -d soa_db -c "ALTER SYSTEM SET log_min_duration_statement = 1000"
```

## 🔧 Scaling

### Horizontal Scaling (Docker Compose)

```yaml
# docker-compose.yml
services:
  user-service:
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
      - PORT=3001
```

### Horizontal Scaling (Kubernetes)

Kubernetes Horizontal Pod Autoscaler (HPA) configuration based on CPU/memory metrics.

### Load Balancing

Nginx configuration for load balancing:

```nginx
upstream user_service {
    least_conn;
    server user-service-1:3001 max_fails=3 fail_timeout=30s;
    server user-service-2:3001 max_fails=3 fail_timeout=30s;
    server user-service-3:3001 max_fails=3 fail_timeout=30s;
}

server {
    location /api/users {
        proxy_pass http://user_service;
    }
}
```

## 📦 SSL/TLS

### Using Let's Encrypt with Certbot

```bash
# Install certbot
apt update && apt install -y certbot python3-certbot-nginx

# Obtain certificates
certbot --nginx -d yourdomain.com

# Certificates will be at /etc/letsencrypt/live/yourdomain.com/
```

### Using Cloudflare (Recommended)

1. Set up Cloudflare proxy for your domain
2. Enable SSL/TLS mode
3. Configure firewall rules (Cloudflare Access)
4. Add WAF rules (Web Application Firewall)

## 📞 Support

For issues, refer to:
- [README.md](./README.md) - Full documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [Better Auth Docs](https://www.better-auth.com/) - Authentication documentation
- [Drizzle Docs](https://org.drizzle.team/) - Database documentation
- [Express Docs](https://expressjs.com/) - Web framework documentation

## 📄 License

MIT License - Feel free to use this boilerplate for your projects!
