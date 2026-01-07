# DB 마이그레이션 실행 가이드

**작성일**: 2025-01-19
**프로젝트**: 냉파고 (Naengpago)
**목적**: DB 스키마 변경 작업(username → nickname)을 실제 DB에 적용하는 방법

---

## 📋 목차

1. [개요](#개요)
2. [사전 준비](#사전-준비)
3. [실행 방법](#실행-방법)
4. [검증 방법](#검증-방법)
5. [롤백 방법](#롤백-방법)

---

## 개요

### 변경 내용
- **nickname 컬럼 삭제**: 비어있는 컬럼 제거
- **username → nickname**: 컬럼명 변경

### 마이그레이션 스크립트 위치
```
backend/src/main/resources/db/migration/rename_username_to_nickname.sql
```

---

## 사전 준비

### ⚠️ 필수 확인사항

1. **백업 필수!**
   ```sql
   -- 전체 users 테이블 백업
   CREATE TABLE users_backup_20250119 AS SELECT * FROM users;
   ```

2. **현재 데이터 확인**
   ```sql
   -- nickname 컬럼이 정말 비어있는지 확인
   SELECT COUNT(*) as total, COUNT(nickname) as has_nickname FROM users;
   -- total과 has_nickname이 다르면 데이터가 있는 것!
   ```

3. **백엔드 서버 중지**
   - Spring Boot 애플리케이션 종료
   - DB 연결이 없는 상태에서 작업

---

## 실행 방법

### 방법 1: pgAdmin 4 사용 (가장 쉬움) ⭐ 추천

#### 1단계: pgAdmin 4 실행
```
시작 메뉴 → pgAdmin 4 실행
```

#### 2단계: 데이터베이스 연결
1. 왼쪽 트리에서 `Servers` 펼치기
2. `PostgreSQL` 서버 선택
3. 비밀번호 입력: `1234`
4. `Databases` → `naengpago` 선택

#### 3단계: Query Tool 열기
1. `naengpago` 데이터베이스 우클릭
2. `Query Tool` 선택

#### 4단계: SQL 스크립트 열기
1. Query Tool 상단 메뉴: `File` → `Open`
2. 파일 선택: `backend/src/main/resources/db/migration/rename_username_to_nickname.sql`

#### 5단계: 실행
1. 전체 선택 (Ctrl + A)
2. 실행 버튼 클릭 (⚡ 아이콘) 또는 `F5` 키

#### 6단계: 결과 확인
- 하단 메시지 패널에서 성공 메시지 확인
- Data Output 탭에서 검증 쿼리 결과 확인

---

### 방법 2: DBeaver 사용

#### 1단계: DBeaver 실행 및 연결
```
1. DBeaver 실행
2. New Database Connection (Ctrl + Shift + N)
3. PostgreSQL 선택
4. 연결 정보 입력:
   - Host: localhost
   - Port: 5432
   - Database: naengpago
   - Username: postgres
   - Password: 1234
5. Test Connection → Finish
```

#### 2단계: SQL Editor 열기
```
1. 연결된 naengpago 우클릭
2. SQL Editor → New SQL Editor
```

#### 3단계: 스크립트 실행
```
1. File → Open File
2. rename_username_to_nickname.sql 선택
3. Execute SQL Script (Ctrl + Alt + X)
```

---

### 방법 3: IntelliJ IDEA Database 도구 사용

#### 1단계: Database 탭 열기
```
View → Tool Windows → Database
```

#### 2단계: PostgreSQL 연결 추가
```
1. Database 탭에서 + 버튼 클릭
2. Data Source → PostgreSQL
3. 연결 정보:
   - Host: localhost
   - Port: 5432
   - Database: naengpago
   - User: postgres
   - Password: 1234
4. Test Connection → OK
```

#### 3단계: Console 열기
```
1. naengpago 데이터베이스 우클릭
2. New → Query Console
```

#### 4단계: 스크립트 실행
```
1. 콘솔에 SQL 스크립트 붙여넣기
2. Execute (Ctrl + Enter)
```

---

### 방법 4: psql 명령줄 (PostgreSQL 설치 시)

#### Windows에서 psql 찾기
```bash
# PostgreSQL이 설치된 경로 찾기
# 보통 C:\Program Files\PostgreSQL\<버전>\bin\psql.exe

# 예시:
cd "C:\Program Files\PostgreSQL\16\bin"
```

#### 스크립트 실행
```bash
# 방법 A: 파일로 실행
psql -h localhost -U postgres -d naengpago -f "C:\dev\project\naengpago\backend\src\main\resources\db\migration\rename_username_to_nickname.sql"

# 방법 B: 대화형으로 실행
psql -h localhost -U postgres -d naengpago
# 비밀번호 입력: 1234

# psql 프롬프트에서:
\i C:/dev/project/naengpago/backend/src/main/resources/db/migration/rename_username_to_nickname.sql
```

---

## 검증 방법

### 1️⃣ 컬럼 존재 확인

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('username', 'nickname')
ORDER BY column_name;
```

**예상 결과**:
```
column_name | data_type         | is_nullable
-----------+-------------------+-------------
nickname    | character varying | NO
```
- ✅ `nickname` 컬럼만 있어야 함
- ❌ `username` 컬럼은 없어야 함

---

### 2️⃣ 데이터 확인

```sql
SELECT user_id, nickname, email, full_name
FROM users
ORDER BY user_id
LIMIT 10;
```

**확인 사항**:
- ✅ `nickname` 컬럼에 기존 username 데이터가 있어야 함
- ✅ NULL 값이 없어야 함

---

### 3️⃣ NULL 체크

```sql
SELECT COUNT(*) as null_nicknames
FROM users
WHERE nickname IS NULL;
```

**예상 결과**: `0` (NULL이 하나도 없어야 함)

---

### 4️⃣ 중복 체크

```sql
SELECT nickname, COUNT(*) as count
FROM users
GROUP BY nickname
HAVING COUNT(*) > 1;
```

**예상 결과**: 행 없음 (중복이 없어야 함)

---

### 5️⃣ 제약 조건 확인

```sql
SELECT
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'users'::regclass
  AND contype IN ('u', 'p')  -- UNIQUE, PRIMARY KEY
ORDER BY conname;
```

**확인 사항**:
- ✅ `nickname`에 UNIQUE 제약 조건이 있어야 함

---

## 롤백 방법

### 문제가 발생한 경우

#### 즉시 롤백 (마이그레이션 직후)

```sql
-- 트랜잭션으로 실행했다면
ROLLBACK;

-- 또는 수동 롤백
ALTER TABLE users RENAME COLUMN nickname TO username;
ALTER TABLE users ADD COLUMN nickname VARCHAR(50);
```

#### 백업에서 복구

```sql
-- 1. 현재 테이블 삭제
DROP TABLE users;

-- 2. 백업에서 복구
CREATE TABLE users AS SELECT * FROM users_backup_20250119;

-- 3. 제약 조건 다시 추가 필요
ALTER TABLE users ADD PRIMARY KEY (user_id);
ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);
-- 기타 제약 조건들...
```

---

## 실행 체크리스트

### 실행 전

- [ ] **백업 완료**
  ```sql
  CREATE TABLE users_backup_20250119 AS SELECT * FROM users;
  ```

- [ ] **nickname 컬럼이 비어있는지 확인**
  ```sql
  SELECT COUNT(nickname) FROM users;
  -- 결과: 0이어야 함
  ```

- [ ] **백엔드 서버 중지**

- [ ] **DB 도구 준비** (pgAdmin, DBeaver, IntelliJ 중 하나)

### 실행 중

- [ ] **SQL 스크립트 열기**
  - `backend/src/main/resources/db/migration/rename_username_to_nickname.sql`

- [ ] **전체 스크립트 실행**

- [ ] **에러 메시지 확인**
  - 에러 발생 시 즉시 중단하고 롤백

### 실행 후

- [ ] **컬럼 존재 확인**
  - `nickname` 있음, `username` 없음

- [ ] **데이터 확인**
  - `nickname`에 기존 데이터 있음

- [ ] **NULL 체크**
  - NULL 값 0개

- [ ] **중복 체크**
  - 중복 없음

- [ ] **제약 조건 확인**
  - UNIQUE 제약 조건 유지

---

## 다음 단계

DB 마이그레이션 완료 후:

1. **백엔드 코드 수정**
   - `USERNAME_TO_NICKNAME_MIGRATION_GUIDE.md` 참고
   - User.java, Repository, DTO, Service 등 수정

2. **백엔드 빌드 및 테스트**
   ```bash
   cd backend
   ./gradlew clean build
   ```

3. **프론트엔드 코드 수정**
   - types/index.ts 수정

4. **통합 테스트**
   - 회원가입, 로그인, 프로필 조회/수정 테스트

---

## 문제 해결

### 문제: "permission denied" 에러

**원인**: postgres 사용자 권한 없음

**해결**:
```sql
-- postgres 사용자로 다시 연결
-- 또는 슈퍼유저 권한 부여
```

### 문제: "column does not exist" 에러

**원인**: 이미 마이그레이션 실행됨

**해결**: 현재 상태 확인
```sql
\d users;  -- psql에서
-- 또는
SELECT * FROM information_schema.columns WHERE table_name = 'users';
```

### 문제: "cannot drop column nickname because other objects depend on it"

**원인**: 다른 객체(인덱스, 제약 조건 등)가 nickname 컬럼 사용 중

**해결**:
```sql
-- CASCADE 옵션으로 삭제
ALTER TABLE users DROP COLUMN nickname CASCADE;
```

---

## 추가 정보

### PostgreSQL 버전 확인
```sql
SELECT version();
```

### 현재 연결 정보 확인
```sql
SELECT current_database(), current_user;
```

### 테이블 구조 확인
```sql
-- psql
\d users

-- 또는 SQL
SELECT
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

---

**작성자**: Claude Code
**최종 수정**: 2025-01-19

## 🆘 도움이 필요하면

1. 백업 먼저!
2. 천천히 단계별로 진행
3. 에러 메시지는 전체 복사해서 확인
4. 문제 발생 시 롤백 후 다시 시도
