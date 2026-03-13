# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RealWorld (Conduit) blog platform backend API built with Express + Prisma + PostgreSQL + TypeScript. Implements the [RealWorld API spec](https://github.com/gothinkster/realworld-example-apps).

## Commands

```bash
# Install dependencies
npm install

# Generate Prisma client (required after schema changes)
npx prisma generate

# Apply database migrations
npx prisma migrate deploy

# Run dev server (hot reload)
npx nx serve api

# Build for production
npx nx build api

# Run all tests
npx nx test api

# Run a single test file
npx nx test api -- --testPathPattern=auth.service

# Lint
npx nx lint api

# Seed database
npx prisma db seed
```

## Environment Variables

Required in `.env` at project root:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing key (defaults to `'superSecret'` if unset)
- `NODE_ENV` - `production` or `development`

## Architecture

3-layer architecture: **Controller → Service → Prisma ORM**

```
src/
├── main.ts                    # Express app entry (CORS, body-parser, global error handler)
├── app/
│   ├── models/
│   │   └── http-exception.model.ts   # Custom error class (errorCode + message)
│   └── routes/
│       ├── routes.ts          # Mounts all controllers under /api
│       ├── auth/              # User registration, login, profile management
│       ├── article/           # Articles CRUD, comments, favorites (largest module)
│       ├── profile/           # User profiles, follow/unfollow
│       └── tag/               # Popular tags listing
├── prisma/
│   ├── schema.prisma          # 4 entities: User, Article, Comment, Tag
│   ├── prisma-client.ts       # Singleton Prisma client
│   └── seed.ts                # DB seed script
└── tests/
    └── services/              # Unit tests (mocked Prisma via jest-mock-extended)
```

Each module follows the pattern:
- `*.controller.ts` - Express routes, HTTP I/O
- `*.service.ts` - Business logic, Prisma queries
- `*.mapper.ts` / `*.utils.ts` - Transform Prisma results to API response shapes
- `*.model.ts` - TypeScript type definitions

## Key Patterns

- **Auth middleware** (`auth.ts`): `auth.required` (401 if no token) and `auth.optional` (allows anonymous, sets `req.auth?.user?.id` if token present)
- **JWT**: Token in `Authorization: Token <jwt>` or `Bearer <jwt>`. Payload: `{user: {id}}`, expires 60 days
- **Passwords**: bcryptjs with 10 salt rounds
- **Slug generation**: `slugify(title)-userId` for uniqueness
- **Demo flag**: `User.demo` field controls data visibility — unauthenticated users only see demo users' content; authenticated users see demo + their own
- **Error handling**: Services throw `HttpException(statusCode, message)`, caught by global error handler in `main.ts`
- **Cross-module deps**: All modules import `auth.ts` middleware; `article` module uses `profile.utils` for author mapping

## Testing

Tests use `jest-mock-extended` to mock the Prisma client (`src/tests/prisma-mock.ts`). Test files are at `src/tests/services/*.test.ts`. E2E tests are in `e2e/`.

## Documentation

프로젝트 문서는 OpenSpec으로 관리된다. `openspec/specs/`가 단일 문서 소스(single source of truth):

- `openspec/specs/architecture-overview/spec.md` — 아키텍처 개요
- `openspec/specs/api-reference/spec.md` — API 레퍼런스 (19개 엔드포인트)
- `openspec/specs/data-model/spec.md` — 데이터 모델 (4개 엔티티)
- `openspec/specs/auth-flow/spec.md` — 인증 흐름

변경사항 추적: `openspec/changes/`에서 OpenSpec 워크플로우(`/opsx:propose` → `/opsx:apply` → `/opsx:archive`)로 관리.

## Vibe Coding Skills

`.claude/skills/`에 바이브 코딩용 스킬이 정의되어 있다:

| 스킬 | 파일 | 용도 |
|------|------|------|
| API 엔드포인트 추가 | `add-endpoint.md` | 새 엔드포인트 추가 워크플로우 (controller → service → test) |
| DB 마이그레이션 | `db-migration.md` | Prisma 스키마 변경 → 마이그레이션 → 클라이언트 재생성 |
| 테스트 작성 | `write-test.md` | jest-mock-extended 기반 서비스 단위 테스트 패턴 |
| 배포 | `deploy.md` | Docker 빌드 & 배포 워크플로우 |
| 코드 리뷰 | `code-review.md` | ESLint + Prettier + 프로젝트 컨벤션 기반 리뷰 |
