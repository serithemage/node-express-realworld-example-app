## 1. Architecture Overview 문서 작성

- [x] 1.1 프로젝트 개요 섹션 작성 (목적, 기술 스택, 주요 의존성 테이블)
- [x] 1.2 디렉토리 구조 트리 및 각 디렉토리/파일 용도 설명 작성
- [x] 1.3 3계층 아키텍처(Controller → Service → Prisma) 다이어그램 및 요청 처리 흐름 작성
- [x] 1.4 4개 도메인 모듈(auth, article, profile, tag) 구성 및 책임 범위 설명 작성
- [x] 1.5 모듈 간 의존성 관계 및 크로스 모듈 참조 문서화
- [x] 1.6 에러 처리 흐름(HttpException, 글로벌 에러 미들웨어) 설명 작성

## 2. API Reference 문서 작성

- [x] 2.1 공통 응답 형식 및 에러 코드(401, 403, 404, 422, 500) 문서 작성
- [x] 2.2 Auth API 레퍼런스 작성 (POST /users, POST /users/login, GET /user, PUT /user)
- [x] 2.3 Article CRUD API 레퍼런스 작성 (GET/POST/PUT/DELETE /articles)
- [x] 2.4 Feed API 레퍼런스 작성 (GET /articles/feed)
- [x] 2.5 Comment API 레퍼런스 작성 (GET/POST/DELETE /articles/:slug/comments)
- [x] 2.6 Favorite API 레퍼런스 작성 (POST/DELETE /articles/:slug/favorite)
- [x] 2.7 Profile API 레퍼런스 작성 (GET /profiles/:username, POST/DELETE follow)
- [x] 2.8 Tag API 레퍼런스 작성 (GET /tags)

## 3. Data Model 문서 작성

- [x] 3.1 ER 다이어그램(User, Article, Comment, Tag 간 관계) ASCII 다이어그램 작성
- [x] 3.2 User 엔티티 스키마 문서 작성 (필드, 제약조건, 관계, self-relation)
- [x] 3.3 Article 엔티티 스키마 문서 작성 (필드, slug 생성 규칙, cascade 삭제)
- [x] 3.4 Comment 엔티티 스키마 문서 작성 (필드, cascade 삭제 동작)
- [x] 3.5 Tag 엔티티 스키마 문서 작성 (필드, N:M 관계)
- [x] 3.6 demo 플래그 동작 및 쿼리 필터링 영향 문서 작성

## 4. Auth Flow 문서 작성

- [x] 4.1 JWT 토큰 생성 방식 문서 작성 (페이로드, 서명키, 만료, 알고리즘)
- [x] 4.2 인증 미들웨어 문서 작성 (auth.required vs auth.optional 동작 차이)
- [x] 4.3 토큰 추출 방식 문서 작성 (Token/Bearer 헤더 파싱)
- [x] 4.4 비밀번호 해싱 흐름 문서 작성 (bcryptjs, salt rounds, compare)
- [x] 4.5 전체 인증 흐름 다이어그램 작성 (회원가입, 로그인, 인증된 요청)
- [x] 4.6 엔드포인트별 인증 요구사항 매트릭스 테이블 작성
