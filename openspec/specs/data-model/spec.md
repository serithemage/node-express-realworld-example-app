# Data Model

## ER 다이어그램

```
┌──────────────────────────┐
│          User            │
├──────────────────────────┤
│ id         Int      PK   │
│ email      String   UQ   │
│ username   String   UQ   │
│ password   String        │
│ image      String?       │
│ bio        String?       │
│ demo       Boolean       │
└──────┬──────┬──────┬─────┘
       │      │      │
       │      │      │  N:M (self-relation)
       │      │      └─────────────────────────┐
       │      │         UserFollows             │
       │      │      ┌──────────────────┐       │
       │      │      │ followedBy ◀────┘       │
       │      │      │ following  ◀────────────┘
       │      │      └──────────────────┘
       │      │
       │      │ 1:N (UserArticles)        N:M (UserFavorites)
       │      │                           ┌──────────────────┐
       │      ▼                           │                  │
       │  ┌──────────────────────────┐    │                  │
       │  │        Article           │◀───┘                  │
       │  ├──────────────────────────┤                       │
       │  │ id          Int     PK   │    favoritedBy ◀──────┘
       │  │ slug        String  UQ   │
       │  │ title       String       │         N:M
       │  │ description String       │    ┌──────────────┐
       │  │ body        String       │───▶│     Tag      │
       │  │ createdAt   DateTime     │    ├──────────────┤
       │  │ updatedAt   DateTime     │    │ id    Int PK  │
       │  │ authorId    Int     FK   │    │ name  Str UQ  │
       │  └──────────┬───────────────┘    └──────────────┘
       │             │
       │             │ 1:N
       │             ▼
       │  ┌──────────────────────────┐
       │  │       Comment            │
       │  ├──────────────────────────┤
       │  │ id        Int      PK    │
       │  │ createdAt DateTime       │
       │  │ updatedAt DateTime       │
       │  │ body      String         │
       │  │ articleId Int      FK    │
       └─▶│ authorId  Int      FK    │
          └──────────────────────────┘
```

---

## User

사용자 계정 정보를 저장한다.

### 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| `id` | Int | PK, auto-increment | - | 사용자 고유 ID |
| `email` | String | UNIQUE, NOT NULL | - | 이메일 주소 |
| `username` | String | UNIQUE, NOT NULL | - | 사용자명 |
| `password` | String | NOT NULL | - | bcrypt 해시된 비밀번호 |
| `image` | String? | nullable | `"https://api.realworld.io/images/smiley-cyrus.jpeg"` | 프로필 이미지 URL |
| `bio` | String? | nullable | `null` | 자기소개 |
| `demo` | Boolean | NOT NULL | `false` | 데모 사용자 여부 |

### 관계

| 관계 | 대상 | 유형 | 관계명 | 설명 |
|------|------|------|--------|------|
| `articles` | Article | 1:N | UserArticles | 작성한 게시글 |
| `favorites` | Article | N:M | UserFavorites | 즐겨찾기한 게시글 |
| `followedBy` | User | N:M (self) | UserFollows | 나를 팔로우하는 사용자들 |
| `following` | User | N:M (self) | UserFollows | 내가 팔로우하는 사용자들 |
| `comments` | Comment | 1:N | - | 작성한 댓글 |

### 자기참조 관계 (UserFollows)

User-User 간 N:M 자기참조 관계로, 하나의 `UserFollows` 관계 테이블로 팔로우/팔로잉 양방향을 표현한다:
- `followedBy`: 이 사용자를 팔로우하는 사용자 목록
- `following`: 이 사용자가 팔로우하는 사용자 목록

---

## Article

게시글 정보를 저장한다.

### 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| `id` | Int | PK, auto-increment | - | 게시글 고유 ID |
| `slug` | String | UNIQUE, NOT NULL | - | URL-safe 식별자 |
| `title` | String | NOT NULL | - | 게시글 제목 |
| `description` | String | NOT NULL | - | 게시글 요약 |
| `body` | String | NOT NULL | - | 게시글 본문 |
| `createdAt` | DateTime | NOT NULL | `now()` | 생성 시각 |
| `updatedAt` | DateTime | NOT NULL | `now()` | 수정 시각 |
| `authorId` | Int | FK → User.id | - | 작성자 ID |

### Slug 생성 규칙

```
slug = slugify(title) + "-" + userId
```

예시: `"How to Train Your Dragon"` + userId `1` → `"How-to-Train-Your-Dragon-1"`

- `slugify` 라이브러리로 제목을 URL-safe 문자열로 변환
- userId를 접미사로 추가하여 고유성 보장
- title 변경 시 slug 재생성

### 관계

| 관계 | 대상 | 유형 | Cascade | 설명 |
|------|------|------|---------|------|
| `author` | User | N:1 | onDelete: Cascade | 작성자 (User 삭제 시 게시글도 삭제) |
| `tagList` | Tag | N:M | - | 게시글에 붙은 태그 |
| `favoritedBy` | User | N:M | - | 즐겨찾기한 사용자들 |
| `comments` | Comment | 1:N | - | 게시글의 댓글들 |

---

## Comment

게시글에 대한 댓글 정보를 저장한다.

### 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| `id` | Int | PK, auto-increment | - | 댓글 고유 ID |
| `createdAt` | DateTime | NOT NULL | `now()` | 생성 시각 |
| `updatedAt` | DateTime | NOT NULL | `now()` | 수정 시각 |
| `body` | String | NOT NULL | - | 댓글 본문 |
| `articleId` | Int | FK → Article.id | - | 대상 게시글 ID |
| `authorId` | Int | FK → User.id | - | 작성자 ID |

### 관계

| 관계 | 대상 | 유형 | Cascade | 설명 |
|------|------|------|---------|------|
| `article` | Article | N:1 | onDelete: Cascade | 게시글 삭제 시 댓글도 삭제 |
| `author` | User | N:1 | onDelete: Cascade | 사용자 삭제 시 댓글도 삭제 |

---

## Tag

게시글 분류를 위한 태그 정보를 저장한다.

### 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| `id` | Int | PK, auto-increment | - | 태그 고유 ID |
| `name` | String | UNIQUE, NOT NULL | - | 태그 이름 |

### 관계

| 관계 | 대상 | 유형 | 설명 |
|------|------|------|------|
| `articles` | Article | N:M | 이 태그가 붙은 게시글들 |

태그는 게시글 생성/수정 시 `connectOrCreate`로 관리된다. 존재하지 않는 태그는 자동 생성되고, 이미 존재하면 기존 태그에 연결된다.

---

## demo 플래그

`User.demo` 필드는 데모 데이터의 공개 범위를 제어한다.

### 동작 방식

| 상황 | 표시되는 데이터 |
|------|-----------------|
| **비로그인** (auth.optional, id 없음) | `demo = true`인 사용자의 게시글/댓글/태그만 |
| **로그인** (auth.optional/required, id 있음) | `demo = true`인 사용자의 데이터 + 본인 데이터 |

### 영향받는 쿼리

1. **게시글 목록** (`article.service.ts` - `buildFindAllQuery`): `author.demo = true OR author.id = currentUserId`
2. **댓글 목록** (`article.service.ts` - `getCommentsByArticle`): `comment.author.demo = true OR comment.author.id = currentUserId`
3. **태그 목록** (`tag.service.ts` - `getTags`): `tag.articles.some.author.demo = true OR tag.articles.some.author.id = currentUserId`

이를 통해 데모 환경에서 샘플 데이터를 공개하면서도, 로그인한 사용자는 자신의 데이터를 함께 볼 수 있다.
