## ADDED Requirements

### Requirement: User 엔티티 문서
User 엔티티의 스키마, 필드, 제약조건을 완전히 문서화해야 한다(SHALL).

#### Scenario: User 스키마 확인
- **WHEN** 개발자가 User 엔티티 문서를 확인하면
- **THEN** 모든 필드(id, email, username, password, image, bio, demo)의 타입, 기본값, 제약조건(unique: email/username)이 명시되어 있어야 한다

#### Scenario: User 관계 확인
- **WHEN** 개발자가 User 관계 섹션을 확인하면
- **THEN** articles(1:N, UserArticles), favorites(N:M, UserFavorites), followedBy/following(N:M self-relation, UserFollows), comments(1:N) 관계가 설명되어 있어야 한다

### Requirement: Article 엔티티 문서
Article 엔티티의 스키마, 필드, 제약조건을 완전히 문서화해야 한다(SHALL).

#### Scenario: Article 스키마 확인
- **WHEN** 개발자가 Article 엔티티 문서를 확인하면
- **THEN** 모든 필드(id, slug, title, description, body, createdAt, updatedAt, authorId)의 타입과 제약조건(unique: slug), slug 생성 규칙(slugify(title)-userId)이 명시되어 있어야 한다

#### Scenario: Article 관계 확인
- **WHEN** 개발자가 Article 관계 섹션을 확인하면
- **THEN** author(N:1 → User, onDelete: Cascade), tagList(N:M → Tag), favoritedBy(N:M → User), comments(1:N → Comment) 관계와 cascade 삭제 동작이 설명되어 있어야 한다

### Requirement: Comment 엔티티 문서
Comment 엔티티의 스키마를 완전히 문서화해야 한다(SHALL).

#### Scenario: Comment 스키마 및 관계 확인
- **WHEN** 개발자가 Comment 엔티티 문서를 확인하면
- **THEN** 필드(id, createdAt, updatedAt, body, articleId, authorId)와 관계(article N:1, author N:1, 둘 다 onDelete: Cascade)가 명시되어 있어야 한다

### Requirement: Tag 엔티티 문서
Tag 엔티티의 스키마를 완전히 문서화해야 한다(SHALL).

#### Scenario: Tag 스키마 및 관계 확인
- **WHEN** 개발자가 Tag 엔티티 문서를 확인하면
- **THEN** 필드(id, name)와 제약조건(unique: name), articles(N:M) 관계가 명시되어 있어야 한다

### Requirement: ER 다이어그램
4개 엔티티 간의 전체 관계를 시각적 다이어그램으로 제공해야 한다(SHALL).

#### Scenario: 엔티티 관계 시각화 확인
- **WHEN** 개발자가 ER 다이어그램 섹션을 확인하면
- **THEN** User, Article, Comment, Tag 간의 1:N, N:M 관계가 ASCII 다이어그램으로 표현되어 있고 자기참조 관계(UserFollows)가 포함되어 있어야 한다

### Requirement: demo 플래그 동작 문서
User.demo 필드의 목적과 쿼리에 미치는 영향을 문서화해야 한다(SHALL).

#### Scenario: demo 플래그 영향 확인
- **WHEN** 개발자가 demo 플래그 문서를 확인하면
- **THEN** 비로그인 사용자에게 demo=true 사용자의 게시글/태그만 노출되는 동작, 로그인 사용자에게는 자신의 데이터와 demo 데이터가 함께 노출되는 동작이 설명되어 있어야 한다
