# Auth Flow

## JWT 토큰 생성

`token.utils.ts`에서 JWT 토큰을 생성한다.

| 항목 | 값 |
|------|-----|
| 라이브러리 | `jsonwebtoken` |
| 페이로드 | `{ user: { id: <userId> } }` |
| 서명 키 | `process.env.JWT_SECRET` (미설정 시 `'superSecret'`) |
| 만료 시간 | 60일 (`'60d'`) |
| 알고리즘 | HS256 |

토큰은 회원가입, 로그인, 사용자 조회, 사용자 수정 응답에 항상 포함된다.

---

## 인증 미들웨어

`auth.ts`에서 `express-jwt`를 사용해 두 가지 인증 모드를 제공한다.

### auth.required

- 유효한 JWT 토큰이 **필수**
- 토큰 누락/만료/무효 시 `UnauthorizedError` → `401` 응답
- 검증 성공 시 `req.auth.user.id`에 사용자 ID 설정

### auth.optional

- 토큰 없이도 요청 허용 (`credentialsRequired: false`)
- 토큰이 있으면 검증 후 `req.auth.user.id` 설정
- 토큰이 없으면 `req.auth`는 `undefined`
- 로그인/비로그인 모두 접근 가능하되, 로그인 시 개인화된 응답(예: `favorited`, `following`) 제공

---

## 토큰 추출 방식

`auth.ts`의 `getTokenFromHeaders` 함수가 Authorization 헤더에서 토큰을 추출한다.

```
Authorization: Token eyJhbGciOiJIUzI1NiIs...
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**파싱 로직**:
1. `Authorization` 헤더 존재 확인
2. 공백으로 분리하여 첫 번째 토큰이 `"Token"` 또는 `"Bearer"`인지 확인
3. 두 번째 토큰(실제 JWT)을 반환
4. 헤더가 없거나 형식이 다르면 `null` 반환

---

## 비밀번호 해싱

`bcryptjs` 라이브러리를 사용하여 비밀번호를 안전하게 저장하고 검증한다.

### 해싱 (회원가입 / 비밀번호 변경)

```
평문 비밀번호 → bcrypt.hash(password, 10) → 해시된 비밀번호 → DB 저장
```

- Salt rounds: **10**
- 회원가입(`createUser`)과 사용자 정보 수정(`updateUser`) 시 해싱 수행

### 검증 (로그인)

```
입력 비밀번호 + DB 해시 → bcrypt.compare(input, hash) → true/false
```

- `true`: 로그인 성공, JWT 토큰 발급
- `false`: `403` 에러 (`email or password is invalid`)

---

## 전체 인증 흐름 다이어그램

### 회원가입

```
Client                     Server                           DB
  │                          │                               │
  │  POST /api/users         │                               │
  │  {email, username, pw}   │                               │
  │─────────────────────────▶│                               │
  │                          │  입력값 검증                    │
  │                          │  (email, username, pw 빈값?)   │
  │                          │                               │
  │                          │  중복 검사                      │
  │                          │──────────────────────────────▶│
  │                          │  findUnique(email, username)   │
  │                          │◀──────────────────────────────│
  │                          │                               │
  │                          │  bcrypt.hash(pw, 10)           │
  │                          │                               │
  │                          │  사용자 생성                    │
  │                          │──────────────────────────────▶│
  │                          │  user.create({...})            │
  │                          │◀──────────────────────────────│
  │                          │                               │
  │                          │  generateToken(user.id)        │
  │                          │                               │
  │  201 {user + token}      │                               │
  │◀─────────────────────────│                               │
```

### 로그인

```
Client                     Server                           DB
  │                          │                               │
  │  POST /api/users/login   │                               │
  │  {email, password}       │                               │
  │─────────────────────────▶│                               │
  │                          │  입력값 검증                    │
  │                          │                               │
  │                          │  사용자 조회                    │
  │                          │──────────────────────────────▶│
  │                          │  findUnique({email})           │
  │                          │◀──────────────────────────────│
  │                          │                               │
  │                          │  bcrypt.compare(pw, hash)      │
  │                          │  match? ─── No ──▶ 403 에러   │
  │                          │    │                           │
  │                          │   Yes                          │
  │                          │    │                           │
  │                          │  generateToken(user.id)        │
  │                          │                               │
  │  200 {user + token}      │                               │
  │◀─────────────────────────│                               │
```

### 인증된 요청 (auth.required)

```
Client                     Server                           DB
  │                          │                               │
  │  GET /api/user            │                               │
  │  Authorization: Token xxx │                               │
  │─────────────────────────▶│                               │
  │                          │                               │
  │                          │  getTokenFromHeaders()         │
  │                          │  "Token xxx" → "xxx" 추출      │
  │                          │                               │
  │                          │  express-jwt 검증              │
  │                          │  jwt.verify(xxx, JWT_SECRET)   │
  │                          │                               │
  │                          │  실패? ──▶ 401 Unauthorized    │
  │                          │                               │
  │                          │  성공: req.auth = {user:{id}}  │
  │                          │                               │
  │                          │  Service 호출                   │
  │                          │──────────────────────────────▶│
  │                          │  findUnique({id})              │
  │                          │◀──────────────────────────────│
  │                          │                               │
  │  200 {user + new token}  │                               │
  │◀─────────────────────────│                               │
```

---

## 엔드포인트별 인증 요구사항 매트릭스

| Method | Endpoint | 인증 수준 | 설명 |
|--------|----------|-----------|------|
| `POST` | `/api/users` | None | 회원가입 |
| `POST` | `/api/users/login` | None | 로그인 |
| `GET` | `/api/user` | **Required** | 현재 사용자 조회 |
| `PUT` | `/api/user` | **Required** | 사용자 정보 수정 |
| `GET` | `/api/articles` | Optional | 게시글 목록 |
| `GET` | `/api/articles/feed` | **Required** | 팔로우 피드 |
| `POST` | `/api/articles` | **Required** | 게시글 작성 |
| `GET` | `/api/articles/:slug` | Optional | 게시글 상세 |
| `PUT` | `/api/articles/:slug` | **Required** | 게시글 수정 (본인만) |
| `DELETE` | `/api/articles/:slug` | **Required** | 게시글 삭제 (본인만) |
| `GET` | `/api/articles/:slug/comments` | Optional | 댓글 목록 |
| `POST` | `/api/articles/:slug/comments` | **Required** | 댓글 작성 |
| `DELETE` | `/api/articles/:slug/comments/:id` | **Required** | 댓글 삭제 (본인만) |
| `POST` | `/api/articles/:slug/favorite` | **Required** | 즐겨찾기 추가 |
| `DELETE` | `/api/articles/:slug/favorite` | **Required** | 즐겨찾기 해제 |
| `GET` | `/api/profiles/:username` | Optional | 프로필 조회 |
| `POST` | `/api/profiles/:username/follow` | **Required** | 팔로우 |
| `DELETE` | `/api/profiles/:username/follow` | **Required** | 언팔로우 |
| `GET` | `/api/tags` | Optional | 인기 태그 목록 |

### 요약

- **None** (2개): 회원가입, 로그인
- **Required** (12개): 데이터 변경(생성/수정/삭제) 및 피드/사용자 관리
- **Optional** (5개): 데이터 조회 (비로그인 시 demo 데이터만, 로그인 시 개인화)
