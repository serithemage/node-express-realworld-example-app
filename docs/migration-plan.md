# 바이브 코딩 전환 계획서

## 1. 현황 진단

### 프로젝트 개요
- **스택**: Node.js + Express + Prisma + PostgreSQL + TypeScript
- **빌드 시스템**: Nx + esbuild
- **도메인 모듈**: auth, article, profile, tag (4개)
- **아키텍처**: Controller → Service → Prisma ORM (3-layer)

### 전환 전 상태 (As-Is)
| 영역 | 상태 | 비고 |
|------|------|------|
| 문서화 | 분산된 마크다운 파일 | 단일 소스 없음, 아키텍처 문서 부재 |
| 테스트 | 일부 서비스 테스트 존재 | 깨진 테스트 2개, 커버리지 불명 |
| CI/CD | 없음 | 로컬 빌드만 가능 |
| 스킬 | 없음 | 반복 작업 수동 처리 |
| 개발 명령어 | 분산 | npm/npx 명령어 산재 |

### 전환 후 상태 (To-Be)
| 영역 | 상태 | 비고 |
|------|------|------|
| 문서화 | OpenSpec 통합 | 4개 스펙 문서, CLAUDE.md, 단일 소스 |
| 테스트 | 7개 테스트 스위트, 54개 테스트 | 전체 통과, 인프라 문제 해결 |
| CI/CD | husky + lint-staged | pre-commit(린트+타입), pre-push(테스트+빌드) |
| 스킬 | 5개 바이브 코딩 스킬 | 엔드포인트, 마이그레이션, 테스트, 배포, 리뷰 |
| 개발 명령어 | Makefile 통합 | 14개 통합 명령어 |

---

## 2. 단계별 계획

### Phase 1: 기반 구축 (완료)

#### 1-1. 문서화 통합
- [x] OpenSpec 스펙 문서 4종 작성 (architecture-overview, api-reference, data-model, auth-flow)
- [x] docs/ 디렉토리를 OpenSpec 포인터로 전환
- [x] CLAUDE.md 프로젝트 가이드 생성

#### 1-2. 바이브 코딩 스킬 정의
- [x] add-endpoint.md — API 엔드포인트 추가 워크플로우
- [x] db-migration.md — Prisma 스키마 변경 워크플로우
- [x] write-test.md — jest-mock-extended 테스트 패턴
- [x] deploy.md — Docker 빌드 & 배포 워크플로우
- [x] code-review.md — ESLint + Prettier + 컨벤션 리뷰

### Phase 2: 품질 보증 (완료)

#### 2-1. 테스트 인프라 정비
- [x] jest.config.ts 환경변수 설정 (DATABASE_URL, JWT_SECRET)
- [x] jsonwebtoken 모킹 문제 해결
- [x] Prisma mock 호이스팅 문제 해결
- [x] 깨진 테스트 스위트 수정

#### 2-2. 테스트 확충
- [x] auth.service.test.ts — 12개 테스트 (회원가입, 로그인, 현재 사용자, 프로필 업데이트)
- [x] article.service.test.ts — 18개 테스트 (CRUD, 댓글, 좋아요)
- [x] tag.service.test.ts — 3개 테스트
- [x] article.mapper.test.ts — 8개 테스트 (새 파일)
- [x] author.mapper.test.ts — 4개 테스트 (새 파일)

#### 2-3. 개발 명령어 통합
- [x] Makefile 생성 (14개 명령어)
  - dev, build, test, test-unit, test-e2e, test-cov
  - lint, format, check, typecheck
  - db-migrate, db-seed, db-generate
  - docker, clean

### Phase 3: 자동화 파이프라인 (완료)

#### 3-1. Git Hooks
- [x] husky + lint-staged 설치 및 설정
- [x] pre-commit: lint-staged (ESLint --fix + Prettier) + TypeScript 타입 체크
- [x] pre-push: 전체 테스트 실행 + 빌드 검증
- [x] package.json lint-staged 설정 추가
- [x] CLAUDE.md Git Hooks 섹션 추가

---

## 3. 리스크 분석

| 리스크 | 영향도 | 발생확률 | 완화 방안 |
|--------|--------|----------|-----------|
| 스킬 파일 최신성 유지 실패 | 중 | 중 | 코드 변경 시 관련 스킬 업데이트를 PR 체크리스트에 포함 |
| pre-push 훅으로 인한 push 지연 | 저 | 고 | `--no-verify` 사용법 안내 (긴급 시에만) |
| 테스트 커버리지 감소 | 중 | 중 | write-test 스킬로 새 기능마다 테스트 작성 유도 |
| Prisma mock 호환성 이슈 | 중 | 저 | prisma-mock.ts 공통 모듈 유지, 버전 고정 |
| OpenSpec 문서와 코드 간 괴리 | 고 | 중 | 기능 변경 시 OpenSpec 워크플로우 사용 의무화 |

---

## 4. 성공 지표

### 정량 지표
| 지표 | 목표 | 현재 |
|------|------|------|
| 테스트 통과율 | 100% | 100% (54/54) |
| 테스트 스위트 수 | 7+ | 7 |
| 바이브 코딩 스킬 수 | 5+ | 5 |
| Git Hook 자동 검증 항목 | 4+ | 4 (lint, format, typecheck, test+build) |
| Makefile 명령어 수 | 10+ | 14 |
| OpenSpec 스펙 문서 수 | 4+ | 4 |

### 정성 지표
- AI 코딩 어시스턴트가 CLAUDE.md와 스킬을 참조하여 프로젝트 컨벤션에 맞는 코드 생성
- 새 팀원이 `make` 명령어만으로 전체 개발 워크플로우 수행 가능
- 코드 변경 시 자동으로 린트, 포맷, 타입 체크, 테스트 실행
- 문서와 코드가 OpenSpec 워크플로우를 통해 동기화 유지

---

## 5. 타임라인

```
Phase 1: 기반 구축          ██████████████████████████ 완료
  - 문서화 통합              ████████ 완료
  - 스킬 정의                ████████ 완료
  - CLAUDE.md 생성           ████████ 완료

Phase 2: 품질 보증          ██████████████████████████ 완료
  - 테스트 인프라 정비       ████████ 완료
  - 테스트 확충              ████████ 완료
  - Makefile 통합            ████████ 완료

Phase 3: 자동화 파이프라인  ██████████████████████████ 완료
  - husky + lint-staged      ████████ 완료
  - pre-commit / pre-push    ████████ 완료
  - CLAUDE.md 업데이트       ████████ 완료
```

---

## 6. 향후 과제

### 단기 (권장)
- [ ] GitHub Actions CI 파이프라인 추가 (PR 시 자동 테스트/린트)
- [ ] 테스트 커버리지 리포트 연동 (Jest coverage → CI)
- [ ] profile.service.test.ts 추가

### 중기
- [ ] E2E 테스트 확충 (Supertest 또는 실제 HTTP 테스트)
- [ ] Docker Compose 개발 환경 구성
- [ ] 추가 스킬 정의 (디버깅, 성능 분석 등)

### 장기
- [ ] 모니터링/로깅 표준화
- [ ] API 버전 관리 전략
- [ ] 마이크로서비스 전환 시 바이브 코딩 스킬 확장
