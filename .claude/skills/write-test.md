# Skill: 테스트 작성

jest-mock-extended 기반 서비스 단위 테스트 작성 패턴.

## 트리거
- "테스트 작성", "테스트 추가", "write test", "add test"

## 워크플로우

### 1. 테스트 파일 생성
- 경로: `src/tests/services/<service-name>.service.test.ts`

### 2. 기본 구조
```typescript
import { prismaMock } from '../prisma-mock';
import { functionToTest } from '../../app/routes/<module>/<service>.service';

describe('<ServiceName>', () => {
  describe('<functionName>', () => {
    it('should <expected behavior>', async () => {
      // Arrange: mock 설정
      prismaMock.<model>.<method>.mockResolvedValue(<mockData>);

      // Act: 함수 호출
      const result = await functionToTest(<args>);

      // Assert: 결과 검증
      expect(result).toEqual(<expected>);
    });

    it('should throw HttpException when <error condition>', async () => {
      // Arrange
      prismaMock.<model>.<method>.mockResolvedValue(null);

      // Act & Assert
      await expect(functionToTest(<args>)).rejects.toThrow();
    });
  });
});
```

### 3. Prisma Mock 사용법
- `prismaMock`은 `src/tests/prisma-mock.ts`에서 import
- 주요 메서드: `findUnique`, `findMany`, `findFirst`, `create`, `update`, `delete`, `count`
- `mockResolvedValue` for 정상 응답
- `mockRejectedValue` for 에러 시뮬레이션

### 4. 테스트 케이스 패턴

| 시나리오 | 테스트 내용 |
|----------|-------------|
| 정상 동작 | 입력 → 기대 출력 검증 |
| 유효성 검증 실패 | 빈 필드 → HttpException 422 |
| 리소스 없음 | findUnique null → HttpException 404 |
| 권한 없음 | 다른 userId → HttpException 403 |
| 중복 검사 | 기존 데이터 존재 → HttpException 422 |

### 5. 실행
```bash
# 전체 테스트
npx nx test api

# 특정 파일만
npx nx test api -- --testPathPattern=<service-name>

# watch 모드
npx nx test api -- --watch
```

## 체크리스트
- [ ] 정상 동작 테스트 (happy path)
- [ ] 유효성 검증 에러 테스트
- [ ] 리소스 미존재 테스트 (404)
- [ ] 권한 검증 테스트 (403, 해당 시)
- [ ] 엣지 케이스 테스트
- [ ] `npx nx test api` 전체 통과
