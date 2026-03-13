## ADDED Requirements

### Requirement: 프로젝트 개요 문서
프로젝트의 목적, 기술 스택, 주요 의존성을 설명하는 개요 섹션이 존재해야 한다(SHALL).

#### Scenario: 프로젝트 개요 확인
- **WHEN** 개발자가 architecture-overview 문서를 열면
- **THEN** 프로젝트명(RealWorld Conduit API), 기술 스택(Node.js, Express 4.18, Prisma 4.16, PostgreSQL, TypeScript 5.2), 빌드 도구(Nx 17.2, esbuild), 테스트 프레임워크(Jest 29)가 명시되어 있어야 한다

### Requirement: 계층 구조 다이어그램
Controller → Service → Prisma ORM 3계층 아키텍처를 시각적 다이어그램으로 표현해야 한다(SHALL).

#### Scenario: 요청 처리 흐름 확인
- **WHEN** 개발자가 계층 구조 섹션을 확인하면
- **THEN** HTTP 요청이 Express Router → Controller → Service → Prisma Client → PostgreSQL 순서로 처리되는 흐름이 ASCII 다이어그램으로 표현되어 있어야 한다

#### Scenario: 에러 처리 흐름 확인
- **WHEN** 개발자가 에러 처리 섹션을 확인하면
- **THEN** HttpException 모델을 통한 커스텀 에러 핸들링과 Express 글로벌 에러 미들웨어(main.ts)의 동작 방식이 설명되어 있어야 한다

### Requirement: 모듈 구성 문서
4개 도메인 모듈(auth, article, profile, tag)의 구성과 책임 범위를 설명해야 한다(SHALL).

#### Scenario: 모듈별 파일 구조 확인
- **WHEN** 개발자가 모듈 구성 섹션을 확인하면
- **THEN** 각 모듈의 파일 목록(controller, service, model, mapper 등)과 각 파일의 역할이 설명되어 있어야 한다

#### Scenario: 모듈 간 의존성 확인
- **WHEN** 개발자가 모듈 간 관계를 파악하려 하면
- **THEN** article 모듈이 profile.utils와 auth 미들웨어를 참조하는 등의 크로스 모듈 의존성이 명시되어 있어야 한다

### Requirement: 디렉토리 구조 맵
프로젝트의 전체 디렉토리 트리와 각 디렉토리의 용도를 제공해야 한다(SHALL).

#### Scenario: 소스 코드 위치 파악
- **WHEN** 개발자가 특정 기능의 소스 코드 위치를 찾으려 하면
- **THEN** src/ 하위의 트리 구조와 각 디렉토리/파일의 설명이 제공되어 있어야 한다
