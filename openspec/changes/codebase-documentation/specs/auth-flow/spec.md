## ADDED Requirements

### Requirement: JWT 토큰 생성 문서
JWT 토큰의 생성 방식과 구성을 문서화해야 한다(SHALL).

#### Scenario: 토큰 생성 방식 확인
- **WHEN** 개발자가 토큰 생성 문서를 확인하면
- **THEN** jsonwebtoken 라이브러리 사용, 페이로드 구조({user: {id}}), 서명 키(JWT_SECRET 환경변수, 기본값 'superSecret'), 만료 시간(60일), 알고리즘(HS256)이 명시되어 있어야 한다

### Requirement: JWT 토큰 검증 미들웨어 문서
express-jwt 기반 인증 미들웨어의 동작 방식을 문서화해야 한다(SHALL).

#### Scenario: 필수 인증(auth.required) 동작 확인
- **WHEN** 개발자가 필수 인증 미들웨어 문서를 확인하면
- **THEN** 토큰 누락/만료/무효 시 401 Unauthorized 응답, 성공 시 req.auth.user.id에 사용자 ID 설정되는 동작이 설명되어 있어야 한다

#### Scenario: 선택 인증(auth.optional) 동작 확인
- **WHEN** 개발자가 선택 인증 미들웨어 문서를 확인하면
- **THEN** 토큰 없이도 요청이 허용되지만, 토큰이 있으면 검증 후 req.auth.user.id가 설정되는 동작이 설명되어 있어야 한다

### Requirement: 토큰 추출 방식 문서
HTTP 헤더에서 토큰을 추출하는 방식을 문서화해야 한다(SHALL).

#### Scenario: Authorization 헤더 파싱 확인
- **WHEN** 개발자가 토큰 추출 문서를 확인하면
- **THEN** Authorization 헤더에서 "Token <jwt>" 또는 "Bearer <jwt>" 형식을 모두 지원하며, 두 번째 공백 구분자 이후의 문자열을 토큰으로 사용하는 동작이 설명되어 있어야 한다

### Requirement: 비밀번호 해싱 문서
bcryptjs를 이용한 비밀번호 보안 처리를 문서화해야 한다(SHALL).

#### Scenario: 비밀번호 저장 방식 확인
- **WHEN** 개발자가 비밀번호 보안 문서를 확인하면
- **THEN** bcryptjs 사용, salt rounds(10), 회원가입/비밀번호 변경 시 해싱, 로그인 시 bcrypt.compare로 검증하는 흐름이 설명되어 있어야 한다

### Requirement: 인증 흐름 다이어그램
회원가입, 로그인, 인증된 요청의 전체 흐름을 시각적 다이어그램으로 제공해야 한다(SHALL).

#### Scenario: 전체 인증 흐름 시각화 확인
- **WHEN** 개발자가 인증 흐름 다이어그램을 확인하면
- **THEN** 회원가입(password → bcrypt hash → DB 저장 → JWT 발급), 로그인(email 조회 → bcrypt compare → JWT 발급), 인증 요청(헤더 추출 → JWT 검증 → req.auth 설정) 3가지 흐름이 다이어그램으로 표현되어 있어야 한다

### Requirement: 엔드포인트별 인증 요구사항 매트릭스
모든 API 엔드포인트의 인증 수준(required/optional/none)을 매트릭스로 제공해야 한다(SHALL).

#### Scenario: 인증 매트릭스 확인
- **WHEN** 개발자가 인증 매트릭스를 확인하면
- **THEN** 19개 전체 엔드포인트가 나열되고 각각의 인증 수준(None: 회원가입/로그인, Required: 글쓰기/수정/삭제/팔로우 등, Optional: 글 목록/상세/프로필 조회 등)이 테이블로 명시되어 있어야 한다
