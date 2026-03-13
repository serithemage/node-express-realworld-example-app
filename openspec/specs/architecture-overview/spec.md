# Architecture Overview

## 프로젝트 개요

RealWorld(Conduit) API는 블로그 플랫폼의 백엔드 REST API로, [RealWorld](https://github.com/gothinkster/realworld-example-apps) 스펙을 구현한다. 사용자 인증, 게시글 CRUD, 댓글, 즐겨찾기, 팔로우, 태그 기능을 제공한다.

### 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Runtime | Node.js + TypeScript | TS 5.2 |
| Framework | Express | 4.18 |
| ORM | Prisma Client | 4.16 |
| Database | PostgreSQL | - |
| Auth | jsonwebtoken + express-jwt | jwt 9.x, express-jwt 8.x |
| Password | bcryptjs | 2.4 |
| Build | Nx + esbuild | Nx 17.2 |
| Test | Jest + jest-mock-extended | Jest 29 |
| Lint | ESLint + Prettier | ESLint 8.48 |
| URL | slugify | 1.6 |

### 주요 의존성

| 패키지 | 용도 |
|--------|------|
| `@prisma/client` | PostgreSQL ORM, 타입 안전한 DB 쿼리 |
| `express` | HTTP 서버 프레임워크 |
| `express-jwt` | JWT 검증 미들웨어 |
| `jsonwebtoken` | JWT 토큰 생성 |
| `bcryptjs` | 비밀번호 해싱/검증 |
| `slugify` | 게시글 제목 → URL slug 변환 |
| `cors` | Cross-Origin Resource Sharing |
| `body-parser` | JSON/URL-encoded 요청 본문 파싱 |
| `@ngneat/falso` | 시드 데이터 생성용 faker 라이브러리 |

---

## 디렉토리 구조

```
node-express-realworld-example-app/
├── src/
│   ├── main.ts                          # Express 앱 진입점 (서버 설정 및 구동)
│   ├── app/
│   │   ├── models/
│   │   │   └── http-exception.model.ts  # 커스텀 HTTP 에러 클래스
│   │   └── routes/
│   │       ├── routes.ts                # 라우터 통합 (/api 프리픽스)
│   │       ├── auth/                    # 인증 모듈
│   │       │   ├── auth.controller.ts   # 회원가입/로그인/사용자 관리 라우트
│   │       │   ├── auth.service.ts      # 사용자 CRUD 비즈니스 로직
│   │       │   ├── auth.ts              # JWT 미들웨어 (required/optional)
│   │       │   ├── token.utils.ts       # JWT 토큰 생성 유틸
│   │       │   ├── register-input.model.ts   # 회원가입 입력 타입
│   │       │   ├── registered-user.model.ts  # 회원가입 응답 타입
│   │       │   ├── user.model.ts        # User 타입 정의
│   │       │   └── user-request.d.ts    # Express Request 타입 확장
│   │       ├── article/                 # 게시글 모듈
│   │       │   ├── article.controller.ts # 게시글/댓글/즐겨찾기 라우트
│   │       │   ├── article.service.ts   # 게시글 비즈니스 로직
│   │       │   ├── article.mapper.ts    # Prisma → API 응답 변환
│   │       │   ├── article.model.ts     # Article 타입 정의
│   │       │   ├── author.mapper.ts     # Author 프로필 변환
│   │       │   └── comment.model.ts     # Comment 타입 정의
│   │       ├── profile/                 # 프로필 모듈
│   │       │   ├── profile.controller.ts # 프로필 조회/팔로우 라우트
│   │       │   ├── profile.service.ts   # 프로필 비즈니스 로직
│   │       │   ├── profile.model.ts     # Profile 타입 정의
│   │       │   └── profile.utils.ts     # 프로필 매퍼 유틸
│   │       └── tag/                     # 태그 모듈
│   │           ├── tag.controller.ts    # 태그 목록 라우트
│   │           ├── tag.service.ts       # 태그 조회 로직
│   │           └── tag.model.ts         # Tag 타입 정의
│   ├── prisma/
│   │   ├── schema.prisma               # 데이터베이스 스키마 정의
│   │   ├── prisma-client.ts            # Prisma Client 싱글턴
│   │   └── seed.ts                     # DB 시드 스크립트
│   └── tests/
│       ├── prisma-mock.ts              # Prisma 모킹 유틸
│       └── services/                   # 서비스 유닛 테스트
│           ├── article.service.test.ts
│           ├── auth.service.test.ts
│           ├── profile.service.test.ts
│           └── tag.service.test.ts
├── e2e/                                 # E2E 테스트
│   └── src/
│       ├── server/server.spec.ts
│       └── support/                    # 테스트 설정
├── package.json
├── tsconfig.json
├── nx.json                             # Nx 워크스페이스 설정
├── project.json                        # Nx 프로젝트 설정
├── Dockerfile                          # 컨테이너 빌드
└── README.md
```

---

## 계층 구조 (3-Layer Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTTP Request                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  main.ts                                                        │
│  ┌─────────┐  ┌────────────┐  ┌───────────────┐               │
│  │  CORS   │─▶│BodyParser  │─▶│  routes.ts    │               │
│  └─────────┘  └────────────┘  │  (/api prefix) │               │
│                                └───────┬───────┘               │
│                                        │                        │
│  Global Error Handler (HttpException / UnauthorizedError / 500) │
└────────────────────────────────────────┼────────────────────────┘
                                         │
              ┌──────────┬───────────────┼───────────┐
              ▼          ▼               ▼           ▼
┌──────────────┐ ┌──────────────┐ ┌──────────┐ ┌─────────┐
│    auth      │ │   article    │ │ profile  │ │   tag   │
│  controller  │ │  controller  │ │controller│ │controller│
│              │ │              │ │          │ │         │
│  POST /users │ │ GET /articles│ │GET /prof │ │GET /tags│
│  POST /login │ │ POST/PUT/DEL │ │POST/DEL  │ │         │
│  GET/PUT /usr│ │ comments,fav │ │ follow   │ │         │
└──────┬───────┘ └──────┬───────┘ └────┬─────┘ └────┬────┘
       │                │              │             │
       ▼                ▼              ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────┐ ┌─────────┐
│    auth      │ │   article    │ │ profile  │ │   tag   │
│   service    │ │   service    │ │ service  │ │ service │
│              │ │              │ │          │ │         │
│ createUser   │ │ getArticles  │ │getProfile│ │ getTags │
│ login        │ │ createArticle│ │followUser│ │         │
│ getCurrentUsr│ │ addComment   │ │unfollowUr│ │         │
│ updateUser   │ │ favorite/unf │ │          │ │         │
└──────┬───────┘ └──────┬───────┘ └────┬─────┘ └────┬────┘
       │                │              │             │
       └────────────────┴──────────────┴─────────────┘
                           │
                           ▼
              ┌───────────────────────┐
              │    Prisma Client      │
              │   (prisma-client.ts)  │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │     PostgreSQL        │
              └───────────────────────┘
```

### 요청 처리 흐름

1. **HTTP 요청 수신**: Express가 요청을 받아 미들웨어 체인 실행 (CORS → body-parser)
2. **라우팅**: `routes.ts`가 `/api` 프리픽스 아래로 4개 컨트롤러에 분배
3. **인증 검사**: `auth.ts` 미들웨어가 JWT 토큰 검증 (required 또는 optional)
4. **Controller**: HTTP 요청/응답 처리, Service 호출
5. **Service**: 비즈니스 로직 실행, Prisma를 통한 DB 작업
6. **Mapper**: Prisma 결과를 API 응답 형식으로 변환 (article.mapper, author.mapper, profile.utils)
7. **응답 반환**: JSON 형식으로 클라이언트에 응답

---

## 도메인 모듈

### auth 모듈
사용자 인증 및 계정 관리를 담당한다.

| 파일 | 역할 |
|------|------|
| `auth.controller.ts` | 4개 라우트: 회원가입, 로그인, 현재 사용자 조회, 사용자 정보 수정 |
| `auth.service.ts` | 사용자 생성(bcrypt 해싱), 로그인(bcrypt 검증), 사용자 조회/수정 |
| `auth.ts` | express-jwt 미들웨어 (required/optional 두 가지 모드) |
| `token.utils.ts` | JWT 토큰 생성 (userId 페이로드, 60일 만료) |

### article 모듈
게시글, 댓글, 즐겨찾기 기능을 담당한다. 가장 큰 모듈로 11개 엔드포인트를 제공한다.

| 파일 | 역할 |
|------|------|
| `article.controller.ts` | 11개 라우트: 게시글 CRUD, 피드, 댓글 CRUD, 즐겨찾기 토글 |
| `article.service.ts` | 게시글/댓글/즐겨찾기 비즈니스 로직, Prisma 쿼리 빌더 |
| `article.mapper.ts` | Prisma Article → API 응답 변환 (tagList, favorited, author 매핑) |
| `author.mapper.ts` | Author 정보 → Profile 형태 변환 (following 상태 포함) |

### profile 모듈
사용자 프로필 조회와 팔로우/언팔로우 기능을 담당한다.

| 파일 | 역할 |
|------|------|
| `profile.controller.ts` | 3개 라우트: 프로필 조회, 팔로우, 언팔로우 |
| `profile.service.ts` | 프로필 조회/팔로우 관계 업데이트 |
| `profile.utils.ts` | Prisma User → Profile 응답 변환 (following 상태 계산) |

### tag 모듈
태그 관리를 담당한다. 가장 단순한 모듈이다.

| 파일 | 역할 |
|------|------|
| `tag.controller.ts` | 1개 라우트: 인기 태그 목록 조회 |
| `tag.service.ts` | demo 사용자 + 현재 사용자 기준 인기 태그 Top 10 조회 |

---

## 모듈 간 의존성

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  article module ──────────▶ auth module            │
│      │                        (auth.ts 미들웨어)    │
│      │                                             │
│      ├──────────────────▶ profile module            │
│      │                    (profile.utils 매퍼)      │
│      │                                             │
│      └──────────────────▶ tag module               │
│                           (tag.model 타입)          │
│                                                    │
│  profile module ──────────▶ auth module            │
│                             (auth.ts 미들웨어)      │
│                                                    │
│  tag module ──────────────▶ auth module             │
│                             (auth.ts 미들웨어)      │
│                                                    │
└────────────────────────────────────────────────────┘
```

- **auth.ts**: 모든 모듈이 공유하는 인증 미들웨어 (required/optional)
- **profile.utils.ts**: article 모듈의 author.mapper와 동일한 패턴으로 프로필 매핑 수행
- **tag.model.ts**: article.service에서 태그 타입 참조

---

## 에러 처리 흐름

```
Service Layer                    Controller              Global Error Handler
                                                         (main.ts)
┌──────────┐                    ┌──────────┐            ┌──────────────────┐
│ throw    │                    │ try {    │            │                  │
│ HttpExc- │───────────────────▶│   ...    │────next()─▶│ UnauthorizedError│
│ eption   │                    │ } catch  │            │  → 401           │
│ (422,    │                    │   next() │            │                  │
│  403,    │                    └──────────┘            │ HttpException    │
│  404)    │                                           │  → err.errorCode │
└──────────┘                                           │                  │
                                                       │ 기타 Error       │
                                                       │  → 500           │
                                                       └──────────────────┘
```

### HttpException 클래스
```typescript
class HttpException extends Error {
  errorCode: number;       // HTTP 상태 코드
  message: string | any;   // 에러 메시지 (보통 {errors: {...}} 형태)
}
```

### 에러 처리 우선순위 (main.ts)
1. **UnauthorizedError** (express-jwt): 토큰 누락/만료/무효 → `401`
2. **HttpException** (커스텀): errorCode가 있는 에러 → 해당 상태 코드
3. **기타 Error**: 예상치 못한 에러 → `500`

### 에러 응답 형식
```json
// 유효성 검증 에러 (422)
{ "errors": { "email": ["can't be blank"], "username": ["has already been taken"] } }

// 인증 에러 (401)
{ "status": "error", "message": "missing authorization credentials" }

// 권한 에러 (403)
{ "message": "You are not authorized to update this article" }
```
