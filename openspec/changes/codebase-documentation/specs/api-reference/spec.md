## ADDED Requirements

### Requirement: 인증 API 레퍼런스
Auth 관련 4개 엔드포인트의 완전한 요청/응답 스펙을 제공해야 한다(SHALL).

#### Scenario: 회원가입 API 확인
- **WHEN** 개발자가 회원가입 엔드포인트 문서를 확인하면
- **THEN** POST /api/users의 요청 본문(user.email, user.username, user.password), 성공 응답(201, user 객체 + token), 에러 응답(422 유효성 검증 실패)이 명시되어 있어야 한다

#### Scenario: 로그인 API 확인
- **WHEN** 개발자가 로그인 엔드포인트 문서를 확인하면
- **THEN** POST /api/users/login의 요청 본문(user.email, user.password), 성공 응답(200, user 객체 + token), 에러 응답(403 인증 실패, 422 입력 누락)이 명시되어 있어야 한다

#### Scenario: 현재 사용자 조회/수정 API 확인
- **WHEN** 개발자가 사용자 관리 엔드포인트 문서를 확인하면
- **THEN** GET /api/user (조회)와 PUT /api/user (수정)의 인증 요구사항(Required), 요청/응답 형식이 명시되어 있어야 한다

### Requirement: 게시글 API 레퍼런스
Article 관련 11개 엔드포인트의 완전한 요청/응답 스펙을 제공해야 한다(SHALL).

#### Scenario: 게시글 CRUD API 확인
- **WHEN** 개발자가 게시글 CRUD 문서를 확인하면
- **THEN** GET/POST/PUT/DELETE /api/articles 엔드포인트의 요청 파라미터(slug, offset, limit, tag, author, favorited), 요청 본문(title, description, body, tagList), 인증 요구사항, 응답 형식이 모두 명시되어 있어야 한다

#### Scenario: 댓글 API 확인
- **WHEN** 개발자가 댓글 관련 문서를 확인하면
- **THEN** GET/POST/DELETE /api/articles/:slug/comments 엔드포인트의 스펙이 명시되어 있어야 한다

#### Scenario: 즐겨찾기 API 확인
- **WHEN** 개발자가 즐겨찾기 관련 문서를 확인하면
- **THEN** POST/DELETE /api/articles/:slug/favorite 엔드포인트의 스펙이 명시되어 있어야 한다

#### Scenario: 피드 API 확인
- **WHEN** 개발자가 피드 문서를 확인하면
- **THEN** GET /api/articles/feed의 동작(팔로우한 사용자의 글만 반환), 페이지네이션(offset, limit), 인증 요구사항(Required)이 명시되어 있어야 한다

### Requirement: 프로필 API 레퍼런스
Profile 관련 3개 엔드포인트의 완전한 요청/응답 스펙을 제공해야 한다(SHALL).

#### Scenario: 프로필 및 팔로우 API 확인
- **WHEN** 개발자가 프로필 관련 문서를 확인하면
- **THEN** GET /api/profiles/:username, POST/DELETE /api/profiles/:username/follow의 인증 요구사항, 요청/응답 형식(username, bio, image, following)이 명시되어 있어야 한다

### Requirement: 태그 API 레퍼런스
Tag 엔드포인트의 완전한 요청/응답 스펙을 제공해야 한다(SHALL).

#### Scenario: 태그 목록 API 확인
- **WHEN** 개발자가 태그 문서를 확인하면
- **THEN** GET /api/tags의 동작(인기순 Top 10 태그 반환), 인증 요구사항(Optional), 응답 형식(tags: string[])이 명시되어 있어야 한다

### Requirement: 공통 응답 형식 문서
API 전반에서 사용되는 공통 응답 패턴을 문서화해야 한다(SHALL).

#### Scenario: 에러 응답 형식 확인
- **WHEN** 개발자가 에러 처리 문서를 확인하면
- **THEN** HTTP 상태 코드별 에러 응답 형식(401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation Error, 500 Server Error)과 에러 본문 구조가 명시되어 있어야 한다
