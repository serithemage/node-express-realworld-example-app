## Context

이 프로젝트는 RealWorld(Conduit) 블로그 플랫폼의 백엔드 API로, Node.js + Express + Prisma + PostgreSQL 스택으로 구현되어 있다. 현재 README.md에 기본적인 설정/실행 방법만 있고, 아키텍처, API 스펙, 데이터 모델, 인증 흐름에 대한 체계적인 문서가 없다.

프로젝트 구조:
- `src/main.ts`: Express 앱 진입점 (CORS, body-parser, 에러 핸들링)
- `src/app/routes/`: 4개 도메인 모듈 (auth, article, profile, tag)
- `src/prisma/`: Prisma 스키마 및 클라이언트
- 각 모듈은 controller → service → Prisma 계층 구조를 따름

## Goals / Non-Goals

**Goals:**
- 프로젝트의 전체 아키텍처를 한눈에 파악할 수 있는 문서 제공
- 19개 API 엔드포인트의 완전한 요청/응답 레퍼런스 제공
- 4개 데이터 엔티티 간 관계와 제약조건 명문화
- JWT 인증/인가 흐름의 시각적 설명
- 새로운 기여자의 온보딩 시간 단축

**Non-Goals:**
- 기존 코드 리팩터링이나 기능 변경
- 프론트엔드 관련 문서
- CI/CD 파이프라인 구성 문서
- 성능 벤치마크 또는 부하 테스트 문서

## Decisions

### 1. 문서를 OpenSpec specs로 구조화
- **선택**: 각 문서 영역을 독립된 capability spec으로 작성
- **대안**: 단일 대형 README 또는 Wiki 페이지
- **근거**: 독립된 spec 파일로 관리하면 각 영역을 독립적으로 업데이트/검증 가능. 코드 변경 시 해당 spec만 갱신하면 됨

### 2. 한국어로 문서 작성
- **선택**: 한국어로 작성
- **대안**: 영문 문서
- **근거**: 사용자의 요청 언어에 맞춰 한국어로 작성하여 접근성 향상

### 3. ASCII 다이어그램 활용
- **선택**: 텍스트 기반 ASCII 다이어그램으로 아키텍처와 데이터 흐름 시각화
- **대안**: 외부 도구(Mermaid, Draw.io) 사용
- **근거**: 별도 렌더링 도구 없이 Markdown에서 바로 확인 가능

### 4. 문서 범위를 4개 capability로 분리
- **선택**: architecture-overview, api-reference, data-model, auth-flow
- **근거**: 각 영역이 독립적인 관심사를 다루며, 필요한 문서만 선택적으로 참조 가능

## Risks / Trade-offs

- **[코드 변경 시 문서 동기화]** → 코드 변경 PR에 관련 문서 업데이트를 필수로 포함하는 프로세스 권장
- **[문서 범위 과다]** → Goals/Non-Goals를 명확히 정의하여 범위 통제
- **[한국어 문서의 국제 기여자 접근성]** → 코드 자체의 주석과 변수명은 영문을 유지하므로 코드 레벨의 이해에는 영향 없음
