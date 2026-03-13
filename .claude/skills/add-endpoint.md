# Skill: API 엔드포인트 추가

새로운 REST API 엔드포인트를 프로젝트 컨벤션에 맞게 추가하는 워크플로우.

## 트리거
- "새 엔드포인트 추가", "API 추가", "add endpoint", "add route"

## 워크플로우

### 1. 모델 정의
- `src/app/routes/<module>/<name>.model.ts`에 TypeScript 타입/인터페이스 정의

### 2. 서비스 구현
- `src/app/routes/<module>/<name>.service.ts`에 비즈니스 로직 작성
- Prisma Client를 `src/prisma/prisma-client.ts`에서 import
- 입력 유효성 검증은 서비스에서 수행 (HttpException 422 throw)
- 권한 검증도 서비스에서 수행 (HttpException 403 throw)

### 3. 컨트롤러 라우트 추가
- `src/app/routes/<module>/<name>.controller.ts`에 Express 라우트 추가
- 패턴:
  ```typescript
  router.<method>('/path', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await serviceFunction(req.body/params/query, req.auth?.user?.id);
      res.json({ result });
    } catch (error) {
      next(error);
    }
  });
  ```
- 인증 수준 결정: `auth.required` (데이터 변경) vs `auth.optional` (조회)

### 4. 라우터 등록
- 새 모듈이면 `src/app/routes/routes.ts`에 컨트롤러 등록

### 5. Mapper (필요 시)
- Prisma 결과를 API 응답 형식으로 변환하는 mapper 함수 작성
- `author` 필드에는 `following` 상태 포함 (author.mapper 패턴 참조)

### 6. 테스트 작성
- `src/tests/services/<name>.service.test.ts`에 단위 테스트 추가
- `src/tests/prisma-mock.ts`의 mock Prisma 사용

## 체크리스트
- [ ] 모델 타입 정의
- [ ] 서비스 함수 (유효성 검증 + 비즈니스 로직)
- [ ] 컨트롤러 라우트 (try/catch + next(error))
- [ ] 인증 미들웨어 적용 (required/optional)
- [ ] 단위 테스트 작성
- [ ] `npx nx lint api` 통과
- [ ] `npx nx test api` 통과
