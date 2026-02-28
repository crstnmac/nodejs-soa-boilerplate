.PHONY: help install dev build up down restart clean migrate db:generate db:migrate db:studio db:push db:reset test psql redis-cli status logs logs:gateway logs:user logs:product logs:order

help: ## Show this help message
	@echo ""
	@echo "Available commands:"
	@sed -n 's/^##//p' ${MAKEFILE_LIST}
	@sed -n 's/^##//p' ${MAKEFILE_LIST}

install: ## Install all dependencies
	npm install

dev: ## Start all services in development mode
	npm run dev

dev:gateway: ## Start only gateway
	cd gateway && npm run dev

dev:user: ## Start only user service
	cd services/user-service && npm run dev

dev:product: ## Start only product service
	cd services/product-service && npm run dev

dev:order: ## Start only order service
	cd services/order-service && npm run dev

build: ## Build all packages
	npm run build

up: ## Start all services with Docker
	docker-compose up -d

up:postgres: ## Start only PostgreSQL with Docker
	docker-compose up postgres redis -d

down: ## Stop all Docker containers
	docker-compose down

restart: ## Restart all Docker containers
	docker-compose restart

logs: ## View logs from all services
	docker-compose logs -f

logs:gateway: ## View gateway logs
	docker-compose logs -f gateway

logs:user: ## View user service logs
	docker-compose logs -f user-service

logs:product: ## View product service logs
	docker-compose logs -f product-service

logs:order: ## View order service logs
	docker-compose logs -f order-service

clean: ## Remove all build artifacts
	rm -rf */dist */node_modules shared/*/dist shared/*/node_modules

db:generate: ## Generate Drizzle migrations
	npm run db:generate

db:migrate: ## Apply Drizzle migrations
	npm run db:migrate

db:push: ## Push schema changes to database
	npm run db:push

db:studio: ## Open Drizzle Studio
	npm run db:studio

db:reset: ## Reset database (WARNING: deletes all data)
	docker-compose exec postgres psql -U soa_user -d soa_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	npm run db:migrate

psql: ## Connect to PostgreSQL via psql
	docker-compose exec postgres psql -U soa_user -d soa_db

redis-cli: ## Connect to Redis via redis-cli
	docker-compose exec redis redis-cli

status: ## Show status of all services
	@echo "=== Docker Services ==="
	docker-compose ps
	@echo ""
	@echo "=== Health Checks ==="
	@curl -s http://localhost:3000/health | jq '.' || echo "Gateway: DOWN"
	@curl -s http://localhost:3001/health | jq '.' || echo "User Service: DOWN"
	@curl -s http://localhost:3002/health | jq '.' || echo "Product Service: DOWN"
	@curl -s http://localhost:3003/health | jq '.' || echo "Order Service: DOWN"

test: ## Run all tests
	npm test

install-deps: ## Install global dependencies
	npm install -g pnpm
