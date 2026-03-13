# Skill: 코드 리뷰

ESLint + Prettier + 프로젝트 컨벤션 기반 코드 리뷰 워크플로우.

## 트리거
- "코드 리뷰", "리뷰해줘", "code review", "review"

## 워크플로우

### 1. 정적 분석
```bash
npx nx lint api
```

### 2. 포맷팅 검사
```bash
npx prettier --check "src/**/*.ts"
```

### 3. 타입 체크
```bash
npx tsc --noEmit -p tsconfig.app.json
```

### 4. 테스트 실행
```bash
npx nx test api
```

### 5. 프로젝트 컨벤션 체크

#### 아키텍처 패턴
- [ ] Controller에 비즈니스 로직이 없는가? (Service로 위임)
- [ ] Service에 HTTP 관련 코드(req, res)가 없는가?
- [ ] 에러는 HttpException으로 throw하는가?
- [ ] Controller의 try/catch에서 next(error) 호출하는가?

#### 인증
- [ ] 데이터 변경 엔드포인트에 `auth.required` 적용했는가?
- [ ] 조회 엔드포인트에 `auth.optional` 적용했는가?
- [ ] `req.auth?.user?.id`로 안전하게 접근하는가?

#### Prisma 쿼리
- [ ] `select`로 필요한 필드만 조회하는가? (password 노출 주의)
- [ ] 관계 데이터는 `include`로 조회하는가?
- [ ] N+1 쿼리 문제가 없는가?

#### 데이터 변환
- [ ] Prisma 결과를 직접 반환하지 않고 mapper를 통해 변환하는가?
- [ ] `following`, `favorited` 등 사용자 컨텍스트 필드가 올바르게 계산되는가?
- [ ] `tagList`가 `[{name: "tag"}]`이 아닌 `["tag"]` 형태로 변환되는가?

#### 보안
- [ ] 비밀번호가 응답에 포함되지 않는가?
- [ ] 본인 소유 리소스만 수정/삭제 가능한가? (403 체크)
- [ ] 입력값 trim 처리하는가?

#### demo 플래그
- [ ] 목록 조회 시 `demo = true OR author.id = currentUserId` 필터 적용하는가?

## 심각도 기준

| 수준 | 설명 | 예시 |
|------|------|------|
| **Critical** | 보안/데이터 손실 위험 | 비밀번호 노출, 권한 검증 누락 |
| **Major** | 기능 오류 | 잘못된 쿼리, 누락된 유효성 검증 |
| **Minor** | 컨벤션 위반 | 네이밍, mapper 미사용 |
| **Info** | 개선 제안 | 성능 최적화, 코드 정리 |
