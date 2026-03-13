# API Reference

모든 엔드포인트는 `/api` 프리픽스 아래에 위치한다.

---

## 공통 사항

### 인증

인증이 필요한 엔드포인트는 `Authorization` 헤더에 JWT 토큰을 포함해야 한다:

```
Authorization: Token <jwt_token>
Authorization: Bearer <jwt_token>
```

두 형식 모두 지원된다.

### 인증 수준

| 수준 | 설명 |
|------|------|
| **None** | 인증 불필요 |
| **Optional** | 토큰 없이도 접근 가능, 토큰 있으면 사용자 컨텍스트 추가 |
| **Required** | 유효한 토큰 필수, 없으면 401 |

### 에러 응답 형식

| 상태 코드 | 의미 | 응답 본문 |
|-----------|------|-----------|
| `401` | 인증 실패 (토큰 누락/만료/무효) | `{"status": "error", "message": "missing authorization credentials"}` |
| `403` | 권한 없음 (본인 리소스가 아님) | `{"message": "You are not authorized to ..."}` |
| `404` | 리소스 없음 | `{}` |
| `422` | 유효성 검증 실패 | `{"errors": {"field": ["error message"]}}` |
| `500` | 서버 내부 에러 | `"error message string"` |

---

## Auth API

### POST /api/users

회원가입. 새로운 사용자를 생성하고 JWT 토큰을 반환한다.

**Auth**: None

**Request Body**:
```json
{
  "user": {
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }
}
```

**Success Response** `201 Created`:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "bio": null,
    "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
    "token": "jwt.token.here"
  }
}
```

**Error Responses**:
- `422`: 필수 필드 누락 (`email`, `username`, `password`가 빈 값)
- `422`: 이메일 또는 사용자명 중복 (`has already been taken`)

---

### POST /api/users/login

로그인. 이메일/비밀번호로 인증하고 JWT 토큰을 반환한다.

**Auth**: None

**Request Body**:
```json
{
  "user": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**Success Response** `200 OK`:
```json
{
  "user": {
    "email": "user@example.com",
    "username": "username",
    "bio": null,
    "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
    "token": "jwt.token.here"
  }
}
```

**Error Responses**:
- `422`: 필수 필드 누락 (`email`, `password`가 빈 값)
- `403`: 이메일 또는 비밀번호 불일치 (`email or password is invalid`)

---

### GET /api/user

현재 로그인한 사용자 정보를 조회한다.

**Auth**: Required

**Success Response** `200 OK`:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "bio": null,
    "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
    "token": "jwt.token.here"
  }
}
```

---

### PUT /api/user

현재 로그인한 사용자 정보를 수정한다. 변경할 필드만 포함하면 된다.

**Auth**: Required

**Request Body**:
```json
{
  "user": {
    "email": "new@example.com",
    "username": "newname",
    "password": "newpassword",
    "image": "https://example.com/photo.jpg",
    "bio": "I like to code."
  }
}
```

**Success Response** `200 OK`:
```json
{
  "user": {
    "id": 1,
    "email": "new@example.com",
    "username": "newname",
    "bio": "I like to code.",
    "image": "https://example.com/photo.jpg",
    "token": "jwt.token.here"
  }
}
```

---

## Article API

### GET /api/articles

게시글 목록을 페이지네이션과 필터링으로 조회한다. 비로그인 시 demo 사용자의 게시글만 표시된다.

**Auth**: Optional

**Query Parameters**:

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `offset` | number | 0 | 건너뛸 게시글 수 |
| `limit` | number | 10 | 반환할 게시글 수 |
| `tag` | string | - | 태그로 필터링 |
| `author` | string | - | 작성자 username으로 필터링 |
| `favorited` | string | - | 즐겨찾기한 사용자 username으로 필터링 |

**Success Response** `200 OK`:
```json
{
  "articles": [
    {
      "slug": "how-to-train-your-dragon-1",
      "title": "How to train your dragon",
      "description": "Ever wonder how?",
      "body": "It takes a Composite...",
      "tagList": ["dragons", "training"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "favorited": false,
      "favoritesCount": 2,
      "author": {
        "username": "jake",
        "bio": "I work at statefarm",
        "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
        "following": false
      }
    }
  ],
  "articlesCount": 1
}
```

---

### GET /api/articles/feed

현재 사용자가 팔로우하는 사용자들의 게시글을 조회한다.

**Auth**: Required

**Query Parameters**:

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `offset` | number | 0 | 건너뛸 게시글 수 |
| `limit` | number | 10 | 반환할 게시글 수 |

**Success Response** `200 OK`: articles 목록과 동일한 형식

---

### POST /api/articles

새 게시글을 작성한다.

**Auth**: Required

**Request Body**:
```json
{
  "article": {
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "You have to believe",
    "tagList": ["dragons", "training"]
  }
}
```

- `tagList`는 선택사항. 존재하지 않는 태그는 자동 생성된다.
- `slug`는 `slugify(title)-userId` 형식으로 자동 생성된다.

**Success Response** `201 Created`:
```json
{
  "article": {
    "slug": "how-to-train-your-dragon-1",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "You have to believe",
    "tagList": ["dragons", "training"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": { "username": "jake", "bio": null, "image": "...", "following": false }
  }
}
```

**Error Responses**:
- `422`: `title`, `description`, `body` 중 빈 값
- `422`: 동일 slug의 게시글이 이미 존재 (`title must be unique`)

---

### GET /api/articles/:slug

slug로 게시글 상세를 조회한다.

**Auth**: Optional

**Path Parameters**: `slug` - 게시글 slug

**Success Response** `200 OK`: 단일 article 객체

**Error Responses**:
- `404`: 해당 slug의 게시글 없음

---

### PUT /api/articles/:slug

게시글을 수정한다. 작성자 본인만 수정 가능하다.

**Auth**: Required

**Path Parameters**: `slug` - 게시글 slug

**Request Body**:
```json
{
  "article": {
    "title": "Updated title",
    "description": "Updated description",
    "body": "Updated body",
    "tagList": ["new-tag"]
  }
}
```

변경할 필드만 포함하면 된다. title 변경 시 slug가 재생성된다. tagList 변경 시 기존 태그 연결이 해제되고 새로 연결된다.

**Error Responses**:
- `404`: 게시글 없음
- `403`: 작성자 본인이 아님
- `422`: 새 title의 slug가 이미 존재

---

### DELETE /api/articles/:slug

게시글을 삭제한다. 작성자 본인만 삭제 가능하다.

**Auth**: Required

**Path Parameters**: `slug` - 게시글 slug

**Success Response** `204 No Content`

**Error Responses**:
- `404`: 게시글 없음
- `403`: 작성자 본인이 아님

---

### GET /api/articles/:slug/comments

게시글의 댓글 목록을 조회한다. 비로그인 시 demo 사용자의 댓글만 표시된다.

**Auth**: Optional

**Path Parameters**: `slug` - 게시글 slug

**Success Response** `200 OK`:
```json
{
  "comments": [
    {
      "id": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "body": "Great article!",
      "author": {
        "username": "jake",
        "bio": null,
        "image": "...",
        "following": false
      }
    }
  ]
}
```

---

### POST /api/articles/:slug/comments

게시글에 댓글을 작성한다.

**Auth**: Required

**Path Parameters**: `slug` - 게시글 slug

**Request Body**:
```json
{
  "comment": {
    "body": "Great article!"
  }
}
```

**Success Response** `200 OK`: 단일 comment 객체

**Error Responses**:
- `422`: `body`가 빈 값

---

### DELETE /api/articles/:slug/comments/:id

댓글을 삭제한다. 작성자 본인만 삭제 가능하다.

**Auth**: Required

**Path Parameters**:
- `slug` - 게시글 slug
- `id` - 댓글 ID (숫자)

**Success Response** `200 OK`: `{}`

**Error Responses**:
- `404`: 댓글 없음 또는 본인 댓글이 아님
- `403`: 작성자 본인이 아님

---

### POST /api/articles/:slug/favorite

게시글을 즐겨찾기에 추가한다.

**Auth**: Required

**Path Parameters**: `slug` - 게시글 slug

**Success Response** `200 OK`: `favorited: true`가 포함된 article 객체

---

### DELETE /api/articles/:slug/favorite

게시글 즐겨찾기를 해제한다.

**Auth**: Required

**Path Parameters**: `slug` - 게시글 slug

**Success Response** `200 OK`: `favorited: false`가 포함된 article 객체

---

## Profile API

### GET /api/profiles/:username

사용자 프로필을 조회한다.

**Auth**: Optional

**Path Parameters**: `username` - 조회할 사용자의 username

**Success Response** `200 OK`:
```json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
    "following": false
  }
}
```

**Error Responses**:
- `404`: 해당 username의 사용자 없음

---

### POST /api/profiles/:username/follow

사용자를 팔로우한다.

**Auth**: Required

**Path Parameters**: `username` - 팔로우할 사용자의 username

**Success Response** `200 OK`: `following: true`가 포함된 profile 객체

---

### DELETE /api/profiles/:username/follow

사용자 팔로우를 해제한다.

**Auth**: Required

**Path Parameters**: `username` - 언팔로우할 사용자의 username

**Success Response** `200 OK`: `following: false`가 포함된 profile 객체

---

## Tag API

### GET /api/tags

가장 많이 사용된 인기 태그 Top 10을 조회한다. demo 사용자의 게시글에 사용된 태그와, 로그인한 경우 본인 게시글의 태그를 기준으로 집계한다.

**Auth**: Optional

**Success Response** `200 OK`:
```json
{
  "tags": ["dragons", "training", "reactjs", "angularjs"]
}
```
