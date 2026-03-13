.PHONY: dev build test test-unit test-e2e test-cov lint format check db-migrate db-seed db-generate docker clean

# Development
dev:
	npx nx serve api

build:
	npx nx build api

# Testing
test:
	npx nx test api

test-unit:
	npx nx test api -- --testPathPattern='src/tests/'

test-e2e:
	npx nx e2e e2e

test-cov:
	npx nx test api -- --coverage

# Code Quality
lint:
	npx nx lint api

format:
	npx prettier --write "src/**/*.ts"

check: lint typecheck test

typecheck:
	npx tsc --noEmit -p tsconfig.app.json

# Database
db-migrate:
	npx prisma migrate deploy

db-seed:
	npx prisma db seed

db-generate:
	npx prisma generate

# Docker
docker:
	npx nx docker-build api

# Cleanup
clean:
	rm -rf dist/ coverage/
