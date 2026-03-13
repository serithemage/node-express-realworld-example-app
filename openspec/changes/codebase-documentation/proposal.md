## Why

이 프로젝트는 RealWorld(Conduit) API 스펙을 구현한 Node.js + Express + Prisma 백엔드이지만, 아키텍처, API 엔드포인트, 데이터 모델, 인증 흐름 등에 대한 체계적인 기술 문서가 없다. 새로운 기여자나 유지보수 담당자가 코드베이스를 이해하기 위해 소스 코드를 직접 읽어야 하는 상황이므로, 포괄적인 기술 문서를 작성하여 온보딩과 유지보수를 개선한다.

## What Changes

- 프로젝트 아키텍처 개요 문서 작성 (계층 구조, 모듈 구성, 데이터 흐름)
- API 엔드포인트 레퍼런스 문서 작성 (19개 엔드포인트의 요청/응답 스펙)
- 데이터 모델 및 스키마 문서 작성 (4개 엔티티, 관계, Prisma 스키마 설명)
- 인증/인가 흐름 문서 작성 (JWT 기반 인증 아키텍처)
- 개발 환경 설정 및 배포 가이드 보강

## Capabilities

### New Capabilities
- `architecture-overview`: 프로젝트 전체 아키텍처, 계층 구조(Controller-Service-Prisma), 모듈 구성, 데이터 흐름을 다루는 문서
- `api-reference`: 19개 REST API 엔드포인트의 요청/응답 스펙, 인증 요구사항, 쿼리 파라미터 등 상세 레퍼런스
- `data-model`: 4개 엔티티(User, Article, Comment, Tag)의 스키마, 관계, 제약조건을 설명하는 문서
- `auth-flow`: JWT 인증/인가 흐름, 토큰 생성/검증, 미들웨어 구성을 다루는 문서

### Modified Capabilities
(없음 - 신규 문서화 작업)

## Impact

- `openspec/specs/` 하위에 4개의 capability spec 문서 생성
- 기존 코드에는 변경 없음 (문서화 전용)
- 대상 코드 범위: `src/` 전체 (main.ts, routes/*, prisma/*)
