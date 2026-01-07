# 주소 필드 추가 구현 가이드

**작성일**: 2025-01-19
**프로젝트**: 냉파고 (Naengpago)
**목적**: DB에 존재하는 주소 관련 컬럼(zipcode, address1, address2)을 백엔드 코드에 통합

---

## 📋 목차

1. [개요](#개요)
2. [현재 상태 분석](#현재-상태-분석)
3. [DB와 백엔드 불일치 사항](#db와-백엔드-불일치-사항)
4. [구현 가이드](#구현-가이드)
5. [수정 체크리스트](#수정-체크리스트)

---

## 개요

### 배경
- 프론트엔드에서 Daum 우편번호 API를 사용한 주소 검색 기능 구현 완료
- DB `users` 테이블에 주소 관련 컬럼 존재: `zipcode`, `address1`, `address2`
- 백엔드 코드에서 해당 컬럼들이 누락되거나 부분적으로만 구현됨

### 목표
- DB 스키마와 백엔드 코드 완전 동기화
- 회원가입 시 주소 정보 저장 기능 구현
- 프로필 수정 시 주소 정보 업데이트 기능 구현

---

## 현재 상태 분석

### ✅ DB 스키마 (users 테이블)

| 컬럼명 | 타입 | 설명 | 비고 |
|--------|------|------|------|
| `zipcode` | VARCHAR(10) | 우편번호 | **백엔드 코드 없음** |
| `address1` | VARCHAR(500) | 기본 주소 | 부분 구현 (변수명 address) |
| `address2` | VARCHAR(500) | 상세 주소 | **백엔드 코드 없음** |

### ⚠️ 백엔드 코드 현황

| 파일 | zipcode | address1 | address2 | 상태 |
|------|---------|----------|----------|------|
| **User.java** (Entity) | ❌ | ⚠️ (변수명 address) | ❌ | 불완전 |
| **SignUpRequestDTO** | ❌ | ❌ | ❌ | 미구현 |
| **UserSummaryDTO** | ❌ | ⚠️ (변수명 address) | ❌ | 불완전 |
| **UpdateProfileRequestDTO** | ❌ | ⚠️ (변수명 address) | ❌ | 불완전 |
| **AuthServiceImpl** | ❌ | ⚠️ | ❌ | 불완전 |
| **UserServiceImpl** | ❌ | ⚠️ | ❌ | 불완전 |

---

## DB와 백엔드 불일치 사항

### 1. 누락된 필드
- **zipcode**: 모든 백엔드 코드에서 완전 누락
- **address2**: 모든 백엔드 코드에서 완전 누락

### 2. 변수명 불일치
- **address1**: DB 컬럼명은 `address1`이지만 백엔드 변수명은 `address`
  ```java
  @Column(name = "address1", length = 500)
  private String address;  // ⚠️ 불일치
  ```

### 3. DTO 미구현
- **SignUpRequestDTO**: 주소 관련 필드가 전혀 없음
- 회원가입 시 주소 정보를 받을 수 없는 상태

---

## 구현 가이드

### 1️⃣ User.java (Entity)

**파일 위치**: `backend/src/main/java/com/backend/entity/User.java`

#### 현재 코드 (62-63번 줄)
```java
@Size(max = 500, message = "주소는 500자 이하여야 합니다")
@Column(name = "address1", length = 500)
private String address;

@Column(name = "profile_image", length = 255)
private String profileImage;
```

#### 수정 후
```java
// 우편번호
@Pattern(regexp = "^[0-9]{5}$", message = "우편번호는 5자리 숫자여야 합니다")
@Column(name = "zipcode", length = 10)
private String zipcode;

// 기본 주소
@Size(max = 500, message = "주소는 500자 이하여야 합니다")
@Column(name = "address1", length = 500)
private String address1;  // ⚠️ 변수명 변경: address → address1

// 상세 주소
@Size(max = 500, message = "상세 주소는 500자 이하여야 합니다")
@Column(name = "address2", length = 500)
private String address2;

@Column(name = "profile_image", length = 255)
private String profileImage;
```

**변경 사항**:
- ✅ `zipcode` 필드 추가
- ✅ `address` → `address1`로 변수명 변경
- ✅ `address2` 필드 추가
- ✅ getter/setter는 Lombok이 자동 생성

---

### 2️⃣ SignUpRequestDTO.java

**파일 위치**: `backend/src/main/java/com/backend/dto/SignUpRequestDTO.java`

#### 현재 코드 (46-49번 줄)
```java
@Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10-11자리 숫자여야 합니다")
@Schema(description = "전화번호", example = "01012345678")
private String phone;
}
```

#### 수정 후
```java
@Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10-11자리 숫자여야 합니다")
@Schema(description = "전화번호", example = "01012345678")
private String phone;

@Schema(description = "우편번호", example = "06234")
@Pattern(regexp = "^[0-9]{5}$", message = "우편번호는 5자리 숫자여야 합니다")
private String zipcode;

@Schema(description = "기본 주소", example = "서울시 강남구 테헤란로 123")
@Size(max = 500, message = "주소는 500자 이하여야 합니다")
private String address1;

@Schema(description = "상세 주소", example = "냉파고빌딩 3층")
@Size(max = 500, message = "상세 주소는 500자 이하여야 합니다")
private String address2;
}
```

**변경 사항**:
- ✅ `zipcode` 필드 추가 (5자리 숫자 검증)
- ✅ `address1` 필드 추가
- ✅ `address2` 필드 추가
- ✅ Swagger 문서화 포함

---

### 3️⃣ UserSummaryDTO.java

**파일 위치**: `backend/src/main/java/com/backend/dto/UserSummaryDTO.java`

#### 현재 코드 (35-41번 줄)
```java
@Schema(description = "전화번호", example = "01012345678")
private String phone;

@Schema(description = "주소 (address1 컬럼에 저장)", example = "서울시 강남구 테헤란로 123")
private String address;

@Schema(description = "프로필 이미지 URL", example = "https://example.com/profile.jpg")
private String profileImage;
```

#### 수정 후
```java
@Schema(description = "전화번호", example = "01012345678")
private String phone;

@Schema(description = "우편번호", example = "06234")
private String zipcode;

@Schema(description = "기본 주소", example = "서울시 강남구 테헤란로 123")
private String address1;  // ⚠️ 변수명 변경: address → address1

@Schema(description = "상세 주소", example = "냉파고빌딩 3층")
private String address2;

@Schema(description = "프로필 이미지 URL", example = "https://example.com/profile.jpg")
private String profileImage;
```

**변경 사항**:
- ✅ `zipcode` 필드 추가
- ✅ `address` → `address1`로 변수명 변경
- ✅ `address2` 필드 추가

---

### 4️⃣ UpdateProfileRequestDTO.java

**파일 위치**: `backend/src/main/java/com/backend/dto/UpdateProfileRequestDTO.java`

#### 현재 코드 (27-38번 줄)
```java
@Schema(description = "전화번호", example = "01012345678")
@Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10-11자리 숫자여야 합니다")
private String phone;

@Schema(description = "주소 (address1 컬럼에 저장)", example = "서울시 강남구 테헤란로 123")
@Size(max = 500, message = "주소는 500자 이하여야 합니다")
private String address;

@Schema(description = "비밀번호 (변경 시에만)")
@Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다")
private String password;
```

#### 수정 후
```java
@Schema(description = "전화번호", example = "01012345678")
@Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10-11자리 숫자여야 합니다")
private String phone;

@Schema(description = "우편번호", example = "06234")
@Pattern(regexp = "^[0-9]{5}$", message = "우편번호는 5자리 숫자여야 합니다")
private String zipcode;

@Schema(description = "기본 주소", example = "서울시 강남구 테헤란로 123")
@Size(max = 500, message = "주소는 500자 이하여야 합니다")
private String address1;  // ⚠️ 변수명 변경: address → address1

@Schema(description = "상세 주소", example = "냉파고빌딩 3층")
@Size(max = 500, message = "상세 주소는 500자 이하여야 합니다")
private String address2;

@Schema(description = "비밀번호 (변경 시에만)")
@Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다")
private String password;
```

**변경 사항**:
- ✅ `zipcode` 필드 추가
- ✅ `address` → `address1`로 변수명 변경
- ✅ `address2` 필드 추가

---

### 5️⃣ AuthServiceImpl.java

**파일 위치**: `backend/src/main/java/com/backend/service/impl/AuthServiceImpl.java`

#### 수정 위치 1: 회원가입 시 User 생성 (추정 위치)

**현재 코드**:
```java
User user = User.builder()
    .username(signupRequest.getUsername())
    .email(signupRequest.getEmail())
    .passwordHash(hashedPassword)
    .fullName(signupRequest.getFullName())
    .phone(signupRequest.getPhone())
    // address 필드 없음
    .isActive(true)
    .build();
```

**수정 후**:
```java
User user = User.builder()
    .username(signupRequest.getUsername())
    .email(signupRequest.getEmail())
    .passwordHash(hashedPassword)
    .fullName(signupRequest.getFullName())
    .phone(signupRequest.getPhone())
    .zipcode(signupRequest.getZipcode())      // ✅ 추가
    .address1(signupRequest.getAddress1())    // ✅ 추가
    .address2(signupRequest.getAddress2())    // ✅ 추가
    .isActive(true)
    .build();
```

#### 수정 위치 2: UserSummaryDTO 매핑 (214번 줄 근처)

**현재 코드** (211-216번 줄):
```java
UserSummaryDTO userSummary = UserSummaryDTO.builder()
    .userId(user.getUserId())
    .username(user.getUsername())
    .email(user.getEmail())
    .fullName(user.getFullName())
    .nickname(user.getUsername())
    .phone(user.getPhone())
    .address(user.getAddress())  // ⚠️ 변수명 불일치
    .profileImage(user.getProfileImage())
    .build();
```

**수정 후**:
```java
UserSummaryDTO userSummary = UserSummaryDTO.builder()
    .userId(user.getUserId())
    .username(user.getUsername())
    .email(user.getEmail())
    .fullName(user.getFullName())
    .nickname(user.getUsername())
    .phone(user.getPhone())
    .zipcode(user.getZipcode())        // ✅ 추가
    .address1(user.getAddress1())      // ✅ 변경: address → address1
    .address2(user.getAddress2())      // ✅ 추가
    .profileImage(user.getProfileImage())
    .build();
```

---

### 6️⃣ UserServiceImpl.java

**파일 위치**: `backend/src/main/java/com/backend/service/impl/UserServiceImpl.java`

#### 수정 위치 1: 프로필 업데이트 로직 (55-58번 줄)

**현재 코드**:
```java
// 주소 업데이트 (address1 컬럼에 저장)
if (request.getAddress() != null && !request.getAddress().isBlank()) {
    user.setAddress(request.getAddress());
}
```

**수정 후**:
```java
// 우편번호 업데이트
if (request.getZipcode() != null && !request.getZipcode().isBlank()) {
    user.setZipcode(request.getZipcode());
}

// 기본 주소 업데이트
if (request.getAddress1() != null && !request.getAddress1().isBlank()) {
    user.setAddress1(request.getAddress1());
}

// 상세 주소 업데이트
if (request.getAddress2() != null && !request.getAddress2().isBlank()) {
    user.setAddress2(request.getAddress2());
}
```

#### 수정 위치 2: UserSummaryDTO 매핑 (109-114번 줄)

**현재 코드**:
```java
return UserSummaryDTO.builder()
    .userId(user.getUserId())
    .username(user.getUsername())
    .email(user.getEmail())
    .fullName(user.getFullName())
    .nickname(user.getUsername())
    .phone(user.getPhone())
    .address(user.getAddress())  // ⚠️ 변수명 불일치
    .profileImage(user.getProfileImage())
    .build();
```

**수정 후**:
```java
return UserSummaryDTO.builder()
    .userId(user.getUserId())
    .username(user.getUsername())
    .email(user.getEmail())
    .fullName(user.getFullName())
    .nickname(user.getUsername())
    .phone(user.getPhone())
    .zipcode(user.getZipcode())        // ✅ 추가
    .address1(user.getAddress1())      // ✅ 변경: address → address1
    .address2(user.getAddress2())      // ✅ 추가
    .profileImage(user.getProfileImage())
    .build();
```

---

## 수정 체크리스트

### 📁 Entity & DTO

- [ ] **User.java**
  - [ ] `zipcode` 필드 추가
  - [ ] `address` → `address1` 변수명 변경
  - [ ] `address2` 필드 추가

- [ ] **SignUpRequestDTO.java**
  - [ ] `zipcode` 필드 추가
  - [ ] `address1` 필드 추가
  - [ ] `address2` 필드 추가

- [ ] **UserSummaryDTO.java**
  - [ ] `zipcode` 필드 추가
  - [ ] `address` → `address1` 변수명 변경
  - [ ] `address2` 필드 추가

- [ ] **UpdateProfileRequestDTO.java**
  - [ ] `zipcode` 필드 추가
  - [ ] `address` → `address1` 변수명 변경
  - [ ] `address2` 필드 추가

### 🔧 Service 계층

- [ ] **AuthServiceImpl.java**
  - [ ] 회원가입 시 User 생성 로직에 주소 필드 추가
  - [ ] UserSummaryDTO 매핑 로직 수정

- [ ] **UserServiceImpl.java**
  - [ ] 프로필 업데이트 로직에 주소 필드 처리 추가
  - [ ] UserSummaryDTO 매핑 로직 수정

### ✅ 테스트

- [ ] 회원가입 API 테스트
  - [ ] 주소 정보 포함하여 회원가입 요청
  - [ ] DB에 정상 저장 확인

- [ ] 프로필 조회 API 테스트
  - [ ] 주소 정보 정상 반환 확인

- [ ] 프로필 수정 API 테스트
  - [ ] 주소 정보 수정 기능 확인

---

## 📝 참고사항

### 변수명 변경 주의사항

`address` → `address1` 변수명 변경 시 영향받는 부분:
1. Getter/Setter 메서드명 변경
   - `getAddress()` → `getAddress1()`
   - `setAddress()` → `setAddress1()`
2. 모든 DTO 매핑 코드 수정 필요
3. 테스트 코드 수정 필요

### 프론트엔드 연동

프론트엔드에서 서버로 전송하는 데이터 형식:
```typescript
interface SignupData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  phone?: string;
  address?: {
    postalCode: string;  // → zipcode
    main: string;        // → address1
    detail?: string;     // → address2
  };
  // ...
}
```

백엔드 API 요청 시 매핑:
```typescript
const signupRequest = {
  username: signupData.nickname,
  email: signupData.email,
  password: signupData.password,
  fullName: signupData.name,
  phone: signupData.phone,
  zipcode: signupData.address?.postalCode,
  address1: signupData.address?.main,
  address2: signupData.address?.detail,
};
```

---

## 🎯 완료 후 확인사항

1. ✅ 모든 컴파일 에러 해결
2. ✅ Swagger UI에서 API 문서 확인
3. ✅ Postman/Insomnia로 API 테스트
4. ✅ 프론트엔드와 통합 테스트
5. ✅ DB에 데이터 정상 저장 확인

---

**작성자**: Claude Code
**최종 수정**: 2025-01-19
