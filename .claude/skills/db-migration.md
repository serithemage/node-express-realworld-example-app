# Skill: DB 마이그레이션

Prisma 스키마 변경 → 마이그레이션 → 클라이언트 재생성 워크플로우.

## 트리거
- "DB 변경", "스키마 변경", "마이그레이션", "테이블 추가", "필드 추가"

## 워크플로우

### 1. 스키마 수정
- `src/prisma/schema.prisma` 수정
- 컨벤션:
  - 모델명: PascalCase (Article, Comment)
  - 필드명: camelCase (createdAt, authorId)
  - `@id @default(autoincrement())` for PK
  - `@unique` for unique 제약조건
  - `@default(now())` for 타임스탬프
  - 관계에 `onDelete: Cascade` 고려 (부모 삭제 시 자식도 삭제)

### 2. 마이그레이션 생성
```bash
npx prisma migrate dev --name <설명적-이름>
```
- 이름 형식: `add-<entity>`, `add-<field>-to-<entity>`, `remove-<field>`

### 3. Prisma Client 재생성
```bash
npx prisma generate
```

### 4. 관련 코드 업데이트
- 서비스 파일의 Prisma 쿼리 업데이트
- 모델 타입 정의 업데이트 (해당 `.model.ts`)
- Mapper 업데이트 (새 필드 매핑)

### 5. 시드 데이터 업데이트 (필요 시)
- `src/prisma/seed.ts` 수정

### 6. 검증
```bash
npx nx test api
```

## 체크리스트
- [ ] schema.prisma 수정
- [ ] `npx prisma migrate dev --name <name>` 실행
- [ ] `npx prisma generate` 실행
- [ ] 관련 서비스/모델/mapper 코드 업데이트
- [ ] 시드 데이터 업데이트 (필요 시)
- [ ] 테스트 통과 확인

## 주의사항
- 프로덕션 배포 시에는 `npx prisma migrate deploy` 사용 (dev가 아닌 deploy)
- 데이터 손실 가능한 마이그레이션(컬럼 삭제 등)은 사전에 사용자에게 확인
- N:M 관계는 Prisma의 implicit many-to-many 사용 (별도 join 테이블 불필요)
