# Skill: Docker 빌드 & 배포

Docker 이미지 빌드 및 배포 워크플로우.

## 트리거
- "배포", "도커 빌드", "deploy", "docker build"

## 워크플로우

### 1. 빌드 검증
```bash
npx nx build api
```
- 출력: `dist/api/`

### 2. Docker 이미지 빌드
```bash
npx nx docker-build api
# 또는
docker build -f Dockerfile . -t api
```

### 3. 로컬 테스트 실행
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="<postgresql-url>" \
  -e JWT_SECRET="<secret>" \
  -e NODE_ENV=production \
  api
```

### 4. 프로덕션 배포
배포 대상 서버에서:
```bash
npm ci && npx prisma migrate deploy && node dist/api/main.js
```

## Dockerfile 구조
```
Node.js 이미지
├── npm ci (의존성 설치)
├── npx prisma generate (Prisma Client 생성)
├── npx nx build api (앱 빌드)
└── node dist/api/main.js (서버 실행)
```

## 환경 변수 (필수)
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `JWT_SECRET`: JWT 서명 키
- `NODE_ENV`: `production`
- `PORT`: 서버 포트 (기본 3000)

## 체크리스트
- [ ] `npx nx test api` 통과
- [ ] `npx nx build api` 성공
- [ ] Docker 이미지 빌드 성공
- [ ] 로컬 Docker 실행 테스트
- [ ] 환경 변수 설정 확인
- [ ] DB 마이그레이션 적용 확인
