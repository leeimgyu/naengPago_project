# Username → Nickname 컬럼명 변경 가이드

**작성일**: 2025-01-19
**프로젝트**: 냉파고 (Naengpago)
**목적**: DB의 username 컬럼명을 nickname으로 변경하고, 불필요한 nickname 컬럼 삭제

---

## 📋 목차

1. [개요](#개요)
2. [현재 상태 분석](#현재-상태-분석)
3. [변경 전략](#변경-전략)
4. [구현 가이드](#구현-가이드)
5. [수정 체크리스트](#수정-체크리스트)

---

## 개요

### 배경
- DB에 `username`과 `nickname` 컬럼이 중복 존재
- `nickname` 컬럼은 비어있고 사용되지 않음
- 백엔드 코드에서 `username`을 `nickname`으로 매핑하는 혼란스러운 구조
- 프론트엔드에서는 `nickname`을 주로 사용

### 목표
- DB 스키마 정리: `nickname` 컬럼 삭제, `username` → `nickname` 컬럼명 변경
- 백엔드 코드 통일: 모든 코드에서 `nickname` 사용
- 프론트엔드 통일: `username` 제거하고 `nickname`만 사용
- 일관성 있는 네이밍으로 코드 가독성 향상

---

## 현재 상태 분석

### 🗄️ DB 스키마 (users 테이블)

| 컬럼명 | 타입 | 제약조건 | 현재 용도 | 변경 후 |
|--------|------|---------|----------|---------|
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | 닉네임으로 사용 | → `nickname`으로 변경 |
| `nickname` | VARCHAR(50) | - | **사용 안 함 (비어있음)** | ❌ 삭제 |

### 💻 백엔드 현황

#### Entity (User.java)
```java
@Column(name = "username", nullable = false, unique = true, length = 50)
private String username;  // ⚠️ DB는 username, 실제로는 nickname 용도
```

#### DTO
- **UserSummaryDTO**: `username`과 `nickname` 필드 모두 존재
  ```java
  private String username;  // ⚠️ username을 그대로 매핑
  private String nickname;  // ⚠️ username을 nickname으로 매핑 (중복)
  ```

- **SignUpRequestDTO**: `username` 필드 사용
  ```java
  private String username;  // 회원가입 시 닉네임을 username으로 받음
  ```

- **UpdateProfileRequestDTO**: `nickname` 필드 사용
  ```java
  private String nickname;  // 프로필 수정 시 nickname으로 받음
  ```

#### Service
```java
// AuthServiceImpl.java, UserServiceImpl.java
.username(user.getUsername())  // username 그대로 매핑
.nickname(user.getUsername())  // username을 nickname으로 중복 매핑
```

#### Repository
```java
Optional<User> findByUsername(String username);
boolean existsByUsername(String username);
```

#### Security
```java
// CustomUserDetailsService.java
User user = userRepository.findByUsername(usernameOrEmail)  // username으로 조회
```

### 🎨 프론트엔드 현황

#### types/index.ts
```typescript
export interface User {
  userId: number;
  username: string;  // ⚠️ 백엔드 username
  email: string;
  fullName?: string;
  // 호환성을 위한 추가 필드
  nickname?: string;  // ⚠️ 중복
}

export interface SignupData {
  nickname: string;  // 회원가입에서는 nickname 사용
}
```

---

## 변경 전략

### 🎯 변경 목표

**변경 전**:
```
DB: username (사용) + nickname (비어있음)
Backend Entity: username
Backend DTO: username + nickname (혼재)
Frontend: username + nickname (혼재)
```

**변경 후**:
```
DB: nickname (단일 컬럼)
Backend Entity: nickname
Backend DTO: nickname (통일)
Frontend: nickname (통일)
```

### 📝 변경 순서

1. **DB 스키마 변경** (마이그레이션 스크립트)
2. **백엔드 코드 변경**
   - Entity 수정
   - Repository 수정
   - DTO 수정
   - Service 수정
   - Security 관련 코드 수정
3. **프론트엔드 코드 변경**
4. **테스트 및 검증**

---

## 구현 가이드

## 1️⃣ DB 마이그레이션 스크립트

**파일 생성**: `backend/src/main/resources/db/migration/rename_username_to_nickname.sql`

```sql
-- username 컬럼을 nickname으로 변경
-- 작성일: 2025-01-19
-- 목적: username과 nickname 컬럼 통합

-- 1. 기존 nickname 컬럼 삭제 (비어있음)
ALTER TABLE users DROP COLUMN IF EXISTS nickname;

-- 2. username 컬럼명을 nickname으로 변경
ALTER TABLE users RENAME COLUMN username TO nickname;

-- 3. 변경 확인
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name = 'nickname';

-- 4. 데이터 확인
SELECT user_id, nickname, email, full_name
FROM users
LIMIT 5;

-- 예상 결과:
-- column_name | data_type       | character_maximum_length | is_nullable
-- nickname    | character varying | 50                      | NO
```

**실행 방법**:
```bash
# PostgreSQL에서 직접 실행
psql -h localhost -U postgres -d naengpago -f backend/src/main/resources/db/migration/rename_username_to_nickname.sql
```

---

## 2️⃣ User.java (Entity)

**파일 위치**: `backend/src/main/java/com/backend/entity/User.java`

### 변경 전 (39-42번 줄)
```java
@NotBlank(message = "사용자 이름은 필수입니다")
@Size(min = 3, max = 50, message = "사용자 이름은 3자 이상 50자 이하여야 합니다")
@Column(name = "username", nullable = false, unique = true, length = 50)
private String username;
```

### 변경 후
```java
@NotBlank(message = "닉네임은 필수입니다")
@Size(min = 3, max = 50, message = "닉네임은 3자 이상 50자 이하여야 합니다")
@Column(name = "nickname", nullable = false, unique = true, length = 50)
private String nickname;
```

**주의사항**:
- ✅ 변수명 변경: `username` → `nickname`
- ✅ 컬럼명 변경: `name = "username"` → `name = "nickname"`
- ✅ 메시지 변경: "사용자 이름" → "닉네임"
- ✅ Lombok이 자동으로 `getNickname()`, `setNickname()` 생성

---

## 3️⃣ UserRepository.java

**파일 위치**: `backend/src/main/java/com/backend/repository/UserRepository.java`

### 변경 전 (24-45번 줄)
```java
/**
 * 사용자명으로 사용자 조회
 *
 * @param username 사용자명
 * @return Optional<User>
 */
Optional<User> findByUsername(String username);

/**
 * 사용자명 존재 여부 확인
 *
 * @param username 사용자명
 * @return 존재하면 true
 */
boolean existsByUsername(String username);
```

### 변경 후
```java
/**
 * 닉네임으로 사용자 조회
 *
 * @param nickname 닉네임
 * @return Optional<User>
 */
Optional<User> findByNickname(String nickname);

/**
 * 닉네임 존재 여부 확인
 *
 * @param nickname 닉네임
 * @return 존재하면 true
 */
boolean existsByNickname(String nickname);
```

**변경 사항**:
- ✅ 메서드명: `findByUsername` → `findByNickname`
- ✅ 메서드명: `existsByUsername` → `existsByNickname`
- ✅ 파라미터명: `username` → `nickname`
- ✅ JavaDoc 주석 업데이트

---

## 4️⃣ SignUpRequestDTO.java

**파일 위치**: `backend/src/main/java/com/backend/dto/SignUpRequestDTO.java`

### 변경 전 (23-26번 줄)
```java
@NotBlank(message = "사용자 이름은 필수입니다")
@Size(min = 3, max = 50, message = "사용자 이름은 3자 이상 50자 이하여야 합니다")
@Schema(description = "사용자명", example = "testuser", required = true)
private String username;
```

### 변경 후
```java
@NotBlank(message = "닉네임은 필수입니다")
@Size(min = 3, max = 50, message = "닉네임은 3자 이상 50자 이하여야 합니다")
@Schema(description = "닉네임", example = "냉파고맨", required = true)
private String nickname;
```

**변경 사항**:
- ✅ 변수명: `username` → `nickname`
- ✅ 메시지 및 설명 업데이트
- ✅ example 값을 한글 닉네임으로 변경

---

## 5️⃣ UserSummaryDTO.java

**파일 위치**: `backend/src/main/java/com/backend/dto/UserSummaryDTO.java`

### 변경 전 (19-32번 줄)
```java
@Schema(description = "사용자 ID", example = "1")
private Integer userId;

@Schema(description = "사용자명 (로그인 ID)", example = "testuser")
private String username;

@Schema(description = "이메일", example = "test@example.com")
private String email;

@Schema(description = "전체 이름", example = "테스트 사용자")
private String fullName;

@Schema(description = "닉네임 (화면 표시용, username과 동일)", example = "냉파고맨")
private String nickname;
```

### 변경 후
```java
@Schema(description = "사용자 ID", example = "1")
private Integer userId;

@Schema(description = "닉네임", example = "냉파고맨")
private String nickname;

@Schema(description = "이메일", example = "test@example.com")
private String email;

@Schema(description = "전체 이름", example = "테스트 사용자")
private String fullName;
```

**변경 사항**:
- ❌ `username` 필드 **삭제**
- ✅ `nickname` 필드만 유지
- ✅ 설명 간소화

---

## 6️⃣ UpdateProfileRequestDTO.java

**파일 위치**: `backend/src/main/java/com/backend/dto/UpdateProfileRequestDTO.java`

### 변경 전 (21-23번 줄)
```java
@Schema(description = "닉네임 (username 컬럼에 저장)", example = "냉파고맨")
@Size(max = 50, message = "닉네임은 50자 이하여야 합니다")
private String nickname;
```

### 변경 후
```java
@Schema(description = "닉네임", example = "냉파고맨")
@Size(min = 3, max = 50, message = "닉네임은 3자 이상 50자 이하여야 합니다")
private String nickname;
```

**변경 사항**:
- ✅ 설명에서 "username 컬럼에 저장" 문구 제거
- ✅ 최소 길이 검증 추가 (Entity와 일관성)

---

## 7️⃣ AuthServiceImpl.java

**파일 위치**: `backend/src/main/java/com/backend/service/impl/AuthServiceImpl.java`

### 변경 위치 1: 회원가입 로직 (45, 54-56, 61번 줄)

#### 변경 전
```java
log.info("회원가입 시도: username={}, email={}", signUpRequest.getUsername(), signUpRequest.getEmail());

// 사용자명 중복 체크
if (userRepository.existsByUsername(signUpRequest.getUsername())) {
    log.warn("사용자명 중복: {}", signUpRequest.getUsername());
    throw new DuplicateResourceException("이미 사용 중인 사용자명입니다: " + signUpRequest.getUsername());
}

// User 엔티티 생성
User user = User.builder()
        .username(signUpRequest.getUsername())
        .email(signUpRequest.getEmail())
        // ...
```

#### 변경 후
```java
log.info("회원가입 시도: nickname={}, email={}", signUpRequest.getNickname(), signUpRequest.getEmail());

// 닉네임 중복 체크
if (userRepository.existsByNickname(signUpRequest.getNickname())) {
    log.warn("닉네임 중복: {}", signUpRequest.getNickname());
    throw new DuplicateResourceException("이미 사용 중인 닉네임입니다: " + signUpRequest.getNickname());
}

// User 엔티티 생성
User user = User.builder()
        .nickname(signUpRequest.getNickname())
        .email(signUpRequest.getEmail())
        // ...
```

### 변경 위치 2: UserSummaryDTO 매핑 (210-215번 줄)

#### 변경 전
```java
return UserSummaryDTO.builder()
        .userId(user.getUserId())
        .username(user.getUsername())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .nickname(user.getUsername())  // username을 nickname으로 매핑
        .phone(user.getPhone())
        // ...
```

#### 변경 후
```java
return UserSummaryDTO.builder()
        .userId(user.getUserId())
        .nickname(user.getNickname())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .phone(user.getPhone())
        // ...
```

**변경 사항**:
- ❌ `.username()` 제거
- ✅ `.nickname(user.getNickname())` 한 줄로 정리
- ✅ 중복 매핑 제거

---

## 8️⃣ UserServiceImpl.java

**파일 위치**: `backend/src/main/java/com/backend/service/impl/UserServiceImpl.java`

### 변경 위치 1: 프로필 업데이트 (45-48번 줄)

#### 변경 전
```java
// 닉네임 업데이트 (username 컬럼에 저장)
if (request.getNickname() != null && !request.getNickname().isBlank()) {
    user.setUsername(request.getNickname());
}
```

#### 변경 후
```java
// 닉네임 업데이트
if (request.getNickname() != null && !request.getNickname().isBlank()) {
    user.setNickname(request.getNickname());
}
```

### 변경 위치 2: UserSummaryDTO 매핑 (115-120번 줄)

#### 변경 전
```java
return UserSummaryDTO.builder()
        .userId(user.getUserId())
        .username(user.getUsername())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .nickname(user.getUsername())  // username을 nickname으로 매핑
        // ...
```

#### 변경 후
```java
return UserSummaryDTO.builder()
        .userId(user.getUserId())
        .nickname(user.getNickname())
        .email(user.getEmail())
        .fullName(user.getFullName())
        // ...
```

---

## 9️⃣ CustomUserDetailsService.java

**파일 위치**: `backend/src/main/java/com/backend/security/userdetails/CustomUserDetailsService.java`

### 변경 전 (16, 27-28, 30, 36, 39번 줄)
```java
/**
 * Spring Security UserDetailsService 구현체
 *
 * - 사용자명(username 또는 email)으로 사용자 조회
 * - UserPrincipal로 변환하여 반환
 */

/**
 * 사용자명으로 사용자 조회
 * - username 또는 email로 조회 시도
 *
 * @param usernameOrEmail 사용자명 또는 이메일
 * @return UserDetails
 * @throws UsernameNotFoundException 사용자를 찾을 수 없는 경우
 */
@Override
@Transactional(readOnly = true)
public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
    log.debug("사용자 조회 시도: {}", usernameOrEmail);

    User user = userRepository.findByUsername(usernameOrEmail)
            .or(() -> userRepository.findByEmail(usernameOrEmail))
            .orElseThrow(() -> new UsernameNotFoundException(
                    "사용자를 찾을 수 없습니다: " + usernameOrEmail
            ));
    // ...
}
```

### 변경 후
```java
/**
 * Spring Security UserDetailsService 구현체
 *
 * - 닉네임(nickname 또는 email)으로 사용자 조회
 * - UserPrincipal로 변환하여 반환
 */

/**
 * 닉네임 또는 이메일로 사용자 조회
 * - nickname 또는 email로 조회 시도
 *
 * @param nicknameOrEmail 닉네임 또는 이메일
 * @return UserDetails
 * @throws UsernameNotFoundException 사용자를 찾을 수 없는 경우
 */
@Override
@Transactional(readOnly = true)
public UserDetails loadUserByUsername(String nicknameOrEmail) throws UsernameNotFoundException {
    log.debug("사용자 조회 시도: {}", nicknameOrEmail);

    User user = userRepository.findByNickname(nicknameOrEmail)
            .or(() -> userRepository.findByEmail(nicknameOrEmail))
            .orElseThrow(() -> new UsernameNotFoundException(
                    "사용자를 찾을 수 없습니다: " + nicknameOrEmail
            ));
    // ...
}
```

**변경 사항**:
- ✅ 주석: "사용자명" → "닉네임"
- ✅ 파라미터명: `usernameOrEmail` → `nicknameOrEmail`
- ✅ 메서드: `findByUsername` → `findByNickname`

**주의**:
- Spring Security의 `loadUserByUsername` 메서드명은 **변경하면 안 됨** (인터페이스 구현)
- 파라미터명과 내부 로직만 변경

---

## 🔟 프론트엔드 수정

### types/index.ts

**파일 위치**: `frontend/src/types/index.ts`

#### 변경 전 (8-22번 줄)
```typescript
export interface User {
  userId: number;           // 백엔드 userId
  username: string;         // 닉네임 (백엔드 username)
  email: string;
  fullName?: string;        // 이름 (백엔드 fullName)
  phone?: string;
  profileImage?: string;    // 프로필 이미지
  // 호환성을 위한 추가 필드
  id?: string;
  name?: string;
  nickname?: string;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}
```

#### 변경 후
```typescript
export interface User {
  userId: number;           // 백엔드 userId
  nickname: string;         // 닉네임
  email: string;
  fullName?: string;        // 이름 (백엔드 fullName)
  phone?: string;
  profileImage?: string;    // 프로필 이미지
  // 호환성을 위한 추가 필드
  id?: string;
  name?: string;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}
```

**변경 사항**:
- ❌ `username` 필드 삭제
- ✅ `nickname`을 주 필드로 승격
- ❌ 중복된 `nickname` 필드 제거

---

## 수정 체크리스트

### 📁 DB 마이그레이션

- [ ] **마이그레이션 스크립트 작성**
  - [ ] `rename_username_to_nickname.sql` 파일 생성
  - [ ] nickname 컬럼 삭제 쿼리
  - [ ] username → nickname 컬럼명 변경 쿼리
  - [ ] 검증 쿼리 포함

- [ ] **마이그레이션 실행**
  - [ ] 로컬 DB에서 스크립트 실행
  - [ ] 변경 결과 확인
  - [ ] 데이터 손실 없는지 확인

### 💻 백엔드 코드

- [ ] **User.java** (Entity)
  - [ ] `username` → `nickname` 변수명 변경
  - [ ] `@Column(name = "nickname")` 변경
  - [ ] 검증 메시지 업데이트

- [ ] **UserRepository.java**
  - [ ] `findByUsername` → `findByNickname` 메서드명 변경
  - [ ] `existsByUsername` → `existsByNickname` 메서드명 변경
  - [ ] JavaDoc 주석 업데이트

- [ ] **SignUpRequestDTO.java**
  - [ ] `username` → `nickname` 필드명 변경
  - [ ] Swagger 문서 업데이트

- [ ] **UserSummaryDTO.java**
  - [ ] `username` 필드 삭제
  - [ ] `nickname` 필드만 유지
  - [ ] 설명 간소화

- [ ] **UpdateProfileRequestDTO.java**
  - [ ] 설명에서 "username 컬럼" 문구 제거
  - [ ] 검증 규칙 확인

- [ ] **AuthServiceImpl.java**
  - [ ] 회원가입 로직: `getUsername()` → `getNickname()`
  - [ ] 중복 체크: `existsByUsername()` → `existsByNickname()`
  - [ ] DTO 매핑: `username` 필드 제거, `nickname`만 사용
  - [ ] 로그 메시지 업데이트

- [ ] **UserServiceImpl.java**
  - [ ] 프로필 업데이트: `setUsername()` → `setNickname()`
  - [ ] DTO 매핑: `username` 필드 제거, `nickname`만 사용
  - [ ] 주석 업데이트

- [ ] **CustomUserDetailsService.java**
  - [ ] `findByUsername()` → `findByNickname()` 변경
  - [ ] 파라미터명: `usernameOrEmail` → `nicknameOrEmail`
  - [ ] JavaDoc 주석 업데이트

### 🎨 프론트엔드 코드

- [ ] **types/index.ts**
  - [ ] User 인터페이스: `username` 필드 제거
  - [ ] `nickname`을 주 필드로 사용
  - [ ] 중복 필드 정리

- [ ] **기타 컴포넌트**
  - [ ] `username` 사용하는 모든 컴포넌트 검색
  - [ ] `nickname`으로 변경
  - [ ] 표시 텍스트 확인

### ✅ 테스트 및 검증

- [ ] **컴파일 테스트**
  - [ ] 백엔드 빌드 성공 확인
  - [ ] 프론트엔드 빌드 성공 확인
  - [ ] 타입 에러 없는지 확인

- [ ] **API 테스트**
  - [ ] 회원가입 API
    - [ ] nickname으로 회원가입 성공
    - [ ] DB에 nickname 컬럼에 저장 확인
    - [ ] 중복 nickname 체크 확인

  - [ ] 로그인 API
    - [ ] nickname으로 로그인 성공
    - [ ] email로 로그인 성공
    - [ ] 응답 데이터에 nickname 포함 확인

  - [ ] 프로필 조회 API
    - [ ] nickname 필드 정상 반환 확인
    - [ ] username 필드 없는지 확인

  - [ ] 프로필 수정 API
    - [ ] nickname 수정 성공 확인
    - [ ] DB 업데이트 확인

- [ ] **통합 테스트**
  - [ ] 프론트엔드-백엔드 연동 확인
  - [ ] 회원가입 → 로그인 → 프로필 조회 플로우 테스트
  - [ ] nickname 표시 확인

---

## 📝 주의사항

### ⚠️ 중요 변경 사항

1. **메서드명 변경**
   - `getUsername()` → `getNickname()`
   - `setUsername()` → `setNickname()`
   - 모든 호출 부분 수정 필요

2. **Repository 쿼리 메서드**
   - Spring Data JPA가 메서드명으로 쿼리 생성
   - `findByUsername` → `findByNickname`: DB 컬럼명 변경 후 자동으로 `nickname` 컬럼 사용

3. **Security 영향**
   - 로그인 시 nickname 또는 email 사용
   - `loadUserByUsername()` 메서드명은 Spring Security 인터페이스이므로 **변경 불가**
   - 파라미터명과 내부 로직만 변경

4. **API 호환성**
   - 기존 클라이언트가 `username` 필드로 요청하면 에러 발생
   - 프론트엔드도 함께 배포 필요
   - 또는 과도기적으로 `username` 필드를 `nickname`으로 자동 매핑하는 로직 추가 고려

### 🔄 롤백 계획

문제 발생 시 롤백 방법:

```sql
-- DB 롤백
ALTER TABLE users RENAME COLUMN nickname TO username;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(50);
```

백엔드/프론트엔드 코드는 Git으로 이전 커밋으로 복구

---

## 🎯 완료 후 확인사항

1. ✅ DB에 `nickname` 컬럼만 존재
2. ✅ 백엔드 코드에서 `username` 변수명 모두 제거
3. ✅ 프론트엔드에서 `nickname`만 사용
4. ✅ Swagger UI에서 API 문서 확인
5. ✅ 회원가입/로그인/프로필 수정 기능 정상 동작
6. ✅ 기존 사용자 데이터 정상 표시

---

## 📚 추가 참고사항

### 프론트엔드 API 호출 변경 예시

**회원가입 API 호출**:
```typescript
// 변경 전
const signupRequest = {
  username: signupData.nickname,  // ⚠️ nickname을 username으로 전송
  email: signupData.email,
  password: signupData.password,
  // ...
};

// 변경 후
const signupRequest = {
  nickname: signupData.nickname,  // ✅ nickname으로 전송
  email: signupData.email,
  password: signupData.password,
  // ...
};
```

**사용자 정보 표시**:
```typescript
// 변경 전
<div>{user.username}</div>  // ⚠️ username 필드 사용

// 변경 후
<div>{user.nickname}</div>  // ✅ nickname 필드 사용
```

---

**작성자**: Claude Code
**최종 수정**: 2025-01-19
