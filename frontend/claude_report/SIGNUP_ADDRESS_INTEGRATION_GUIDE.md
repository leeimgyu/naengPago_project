# 회원가입 주소 데이터 DB 저장 가이드

**작성일**: 2025-01-19
**프로젝트**: 냉파고 (Naengpago)
**목적**: 회원가입 시 주소 데이터(우편번호, 기본주소, 상세주소)를 DB에 저장하는 방법

---

## 📋 목차

1. [현재 상태 분석](#현재-상태-분석)
2. [문제점](#문제점)
3. [해결 방법](#해결-방법)
4. [수정 파일](#수정-파일)
5. [테스트 방법](#테스트-방법)
6. [전체 플로우 확인](#전체-플로우-확인)

---

## 현재 상태 분석

### ✅ 이미 구현된 부분

#### 1. 백엔드 (완벽하게 구현됨)

**User.java** - Entity에 주소 필드 정의됨
```java
// backend/src/main/java/com/backend/entity/User.java (62-74줄)

// 우편번호
@Pattern(regexp = "^[0-9]{5}$", message = "우편번호는 5자리 숫자여야 합니다")
@Column(name = "zipcode", length = 10)
private String zipcode;

// 기본 주소
@Size(max = 100, message = "주소는 100자 이하여야 합니다")
@Column(name = "address1", length = 500)
private String address1;

// 상세 주소
@Size(max = 100, message = "상세 주소는 100자 이하여야 합니다")
@Column(name = "address2", length = 500)
private String address2;
```

**SignUpRequestDTO.java** - 회원가입 요청 DTO에 주소 필드 정의됨
```java
// backend/src/main/java/com/backend/dto/SignUpRequestDTO.java (50-60줄)

@Schema(description = "우편번호", example = "06234")
@Pattern(regexp = "^[0-9]{5}$", message = "우편번호는 5자리 숫자여야 합니다")
private String zipcode;

@Schema(description = "기본 주소", example = "서울시 강남구 테헤란로 123")
@Size(max = 100, message = "주소는 100자 이하여야 합니다")
private String address1;

@Schema(description = "상세 주소", example = "냉파고빌딩 3층")
@Size(max = 100, message = "상세 주소는 100자 이하여야 합니다")
private String address2;
```

**AuthServiceImpl.java** - 회원가입 시 주소 필드 매핑됨
```java
// backend/src/main/java/com/backend/service/impl/AuthServiceImpl.java (66-68줄)

User user = User.builder()
        .username(signUpRequest.getUsername())
        .email(signUpRequest.getEmail())
        .passwordHash(passwordEncoder.encode(signUpRequest.getPassword()))
        .fullName(signUpRequest.getFullName())
        .phone(signUpRequest.getPhone())
        .zipcode(signUpRequest.getZipcode())      // ✅ 주소 필드 매핑
        .address1(signUpRequest.getAddress1())    // ✅ 주소 필드 매핑
        .address2(signUpRequest.getAddress2())    // ✅ 주소 필드 매핑
        .isActive(true)
        .isDeleted(false)
        .build();
```

#### 2. 프론트엔드 UI (완벽하게 구현됨)

**AddressSearch 컴포넌트** - Daum 우편번호 API 연동 완료
```tsx
// frontend/src/components/forms/AddressSearch/AddressSearch.tsx
// ✅ 이미 완벽하게 구현되어 있음
// - Daum 우편번호 검색
// - 우편번호(postalCode), 기본주소(main), 상세주소(detail) 수집
```

**SignupForm.tsx** - 주소 입력 폼 포함됨
```tsx
// frontend/src/pages/Signup/components/SignupForm/SignupForm.tsx (217줄)

{/* 주소 */}
<AddressSearch onAddressSelect={handleAddressSelect} />

// 주소 선택 핸들러 (115-117줄)
const handleAddressSelect = (address: Address) => {
  setFieldValue('address', address);
};

// 초기값 설정 (39줄)
address: undefined,
```

**Address 타입 정의**
```typescript
// frontend/src/types/index.ts (24-28줄)

export interface Address {
  postalCode: string;  // 우편번호
  main: string;        // 기본 주소
  detail?: string;     // 상세 주소
}
```

---

## 문제점

### ❌ 주소 데이터가 백엔드로 전송되지 않음!

**AuthContext.tsx의 signup 함수**에서 주소 데이터를 전송하지 않고 있습니다.

```typescript
// ❌ 현재 코드 (frontend/src/contexts/AuthContext.tsx 123-129줄)

const signupRequest = {
  username: userData.nickname, // 닉네임 → username
  email: userData.email.toLowerCase().trim(),
  password: userData.password,
  fullName: userData.name, // 이름 → fullName
  phone: userData.phone || undefined, // 선택 필드
  // ❌ 주소 필드가 빠져있음!
};
```

### 데이터 변환 매핑 필요

| 프론트엔드 (Address 타입) | 백엔드 (DTO 필드) | 설명 |
|-------------------------|------------------|------|
| `address.postalCode` | `zipcode` | 우편번호 (5자리) |
| `address.main` | `address1` | 기본 주소 |
| `address.detail` | `address2` | 상세 주소 |

---

## 해결 방법

### ✅ AuthContext.tsx 수정

**파일**: `frontend/src/contexts/AuthContext.tsx`

#### 수정 위치: 123-129줄

**변경 전**:
```typescript
const signupRequest = {
  username: userData.nickname,
  email: userData.email.toLowerCase().trim(),
  password: userData.password,
  fullName: userData.name,
  phone: userData.phone || undefined,
};
```

**변경 후**:
```typescript
const signupRequest = {
  username: userData.nickname,
  email: userData.email.toLowerCase().trim(),
  password: userData.password,
  fullName: userData.name,
  phone: userData.phone || undefined,
  // ✅ 주소 필드 추가 (Address → DTO 변환)
  zipcode: userData.address?.postalCode,
  address1: userData.address?.main,
  address2: userData.address?.detail,
};
```

### 코드 설명

- `userData.address?.postalCode` → `zipcode`: 우편번호
- `userData.address?.main` → `address1`: 기본 주소 (도로명 주소 또는 지번 주소)
- `userData.address?.detail` → `address2`: 상세 주소 (건물명, 호수 등)
- `?.` 연산자: 주소가 선택되지 않았을 경우 undefined 처리 (선택 필드)

---

## 수정 파일

### 파일 1: AuthContext.tsx

**파일 경로**: `frontend/src/contexts/AuthContext.tsx`

**수정 내용**:
```typescript
/**
 * ⭐️⭐️⭐️ 회원가입 함수: 실제 백엔드 API 호출 로직 (최종 수정) ⭐️⭐️⭐️
 */
const signup = async (userData: SignupData): Promise<AuthResponse> => {
  // 1. 프론트엔드 데이터를 백엔드 DTO 형식으로 변환
  const signupRequest = {
    username: userData.nickname, // 닉네임 → username
    email: userData.email.toLowerCase().trim(), // 이메일 소문자 변환 및 공백 제거
    password: userData.password,
    fullName: userData.name, // 이름 → fullName
    phone: userData.phone || undefined, // 선택 필드
    // ✅ 주소 필드 추가 (Address 타입을 백엔드 DTO 형식으로 변환)
    zipcode: userData.address?.postalCode,
    address1: userData.address?.main,
    address2: userData.address?.detail,
  };

  // 2. 회원가입 API 호출
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupRequest),
  });

  const result = await response.json();

  // 3. 응답 상태 코드 확인 (백엔드 AuthController는 201 Created를 반환함)
  if (!response.ok) {
    const errorMessage =
      result.message || "회원가입 요청 처리 중 오류가 발생했습니다.";
    throw new Error(errorMessage);
  }

  // 4. 회원가입 성공 응답 처리 (백엔드는 UserSummaryDTO를 반환함)
  const authResponse: AuthResponse = {
    success: result.success,
    message: result.message,
    // 회원가입 성공 응답에는 토큰이 없을 수 있으므로 null 처리
    token: null,
    refreshToken: null,
    user: result.data, // UserSummaryDTO
  };

  return authResponse;
};
```

---

## 테스트 방법

### 1단계: 코드 수정

```bash
# AuthContext.tsx 파일 수정
# 위의 "변경 후" 코드 적용
```

### 2단계: 개발 서버 재시작

```bash
# 백엔드 서버 실행
cd backend
./gradlew bootRun

# 프론트엔드 서버 실행
cd frontend
npm run dev
```

### 3단계: 회원가입 테스트

1. **브라우저에서 회원가입 페이지 접속**
   ```
   http://localhost:5173/signup
   ```

2. **회원가입 폼 작성**
   - 이메일: `test@example.com`
   - 비밀번호: `Test1234`
   - 비밀번호 확인: `Test1234`
   - 이름: `홍길동`
   - 닉네임: `테스트유저`
   - 전화번호: `01012345678`
   - **주소 검색** 클릭 → Daum 우편번호 검색
     - 우편번호: `06234`
     - 기본 주소: `서울시 강남구 테헤란로 123`
     - 상세 주소: `냉파고빌딩 3층`
   - 약관 동의 체크
   - **가입하기** 클릭

3. **DB에서 데이터 확인**

```sql
-- PostgreSQL에서 실행
SELECT
    user_id,
    username,
    email,
    full_name,
    phone,
    zipcode,
    address1,
    address2,
    created_at
FROM users
WHERE email = 'test@example.com';
```

**예상 결과**:
```
user_id | username   | email              | full_name | phone        | zipcode | address1                     | address2         | created_at
--------+------------+--------------------+-----------+--------------+---------+------------------------------+------------------+------------
1       | 테스트유저 | test@example.com   | 홍길동    | 01012345678  | 06234   | 서울시 강남구 테헤란로 123   | 냉파고빌딩 3층   | 2025-01-19...
```

### 4단계: 네트워크 요청 확인

**브라우저 개발자 도구** (F12) → **Network** 탭

1. 회원가입 요청 (`POST /api/auth/signup`) 확인
2. **Request Payload** 확인:

```json
{
  "username": "테스트유저",
  "email": "test@example.com",
  "password": "Test1234",
  "fullName": "홍길동",
  "phone": "01012345678",
  "zipcode": "06234",
  "address1": "서울시 강남구 테헤란로 123",
  "address2": "냉파고빌딩 3층"
}
```

3. **Response** 확인:

```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "userId": 1,
    "username": "테스트유저",
    "email": "test@example.com",
    "fullName": "홍길동",
    "nickname": "테스트유저",
    "phone": "01012345678",
    "zipcode": "06234",
    "address1": "서울시 강남구 테헤란로 123",
    "address2": "냉파고빌딩 3층",
    "profileImage": null
  }
}
```

---

## 전체 플로우 확인

### 회원가입 주소 데이터 플로우

```
[1] 사용자 입력 (Signup 페이지)
    ↓
[2] AddressSearch 컴포넌트 (Daum API 호출)
    - postalCode: "06234"
    - main: "서울시 강남구 테헤란로 123"
    - detail: "냉파고빌딩 3층"
    ↓
[3] SignupForm.tsx (handleAddressSelect)
    - setFieldValue('address', { postalCode, main, detail })
    ↓
[4] 회원가입 버튼 클릭
    - await signup(values)
    ↓
[5] AuthContext.tsx (signup 함수) ✅ 수정 필요!
    - Address 타입 → 백엔드 DTO 변환
    - zipcode: userData.address?.postalCode
    - address1: userData.address?.main
    - address2: userData.address?.detail
    ↓
[6] POST /api/auth/signup
    - JSON Body: { username, email, password, fullName, phone, zipcode, address1, address2 }
    ↓
[7] AuthController.java (회원가입 엔드포인트)
    - SignUpRequestDTO 수신
    ↓
[8] AuthServiceImpl.java (signUp 메서드)
    - User 엔티티 생성 및 주소 필드 매핑
    ↓
[9] UserRepository.save(user)
    - DB users 테이블에 저장
    ↓
[10] DB users 테이블
    - zipcode: "06234"
    - address1: "서울시 강남구 테헤란로 123"
    - address2: "냉파고빌딩 3층"
```

---

## 체크리스트

### 수정 전 확인

- [ ] **백엔드 서버 실행 중**: `./gradlew bootRun` 실행 확인
- [ ] **프론트엔드 서버 실행 중**: `npm run dev` 실행 확인
- [ ] **DB 연결 확인**: PostgreSQL naengpago 데이터베이스 접속 가능 확인

### 수정 작업

- [ ] **AuthContext.tsx 파일 열기**
  ```
  frontend/src/contexts/AuthContext.tsx
  ```

- [ ] **signup 함수 찾기** (121-163줄)

- [ ] **signupRequest 객체 수정** (123-129줄)
  - [ ] `zipcode: userData.address?.postalCode` 추가
  - [ ] `address1: userData.address?.main` 추가
  - [ ] `address2: userData.address?.detail` 추가

- [ ] **파일 저장** (Ctrl + S)

### 수정 후 확인

- [ ] **프론트엔드 재빌드 자동 완료 확인**
  - Vite는 자동으로 Hot Module Replacement 실행

- [ ] **브라우저 콘솔 에러 없음 확인** (F12 → Console)

- [ ] **회원가입 테스트**
  - [ ] 회원가입 페이지 접속
  - [ ] 주소 검색 및 입력
  - [ ] 회원가입 완료 메시지 확인

- [ ] **Network 탭에서 Request Payload 확인**
  - [ ] `zipcode` 필드 포함됨
  - [ ] `address1` 필드 포함됨
  - [ ] `address2` 필드 포함됨

- [ ] **DB에서 데이터 확인**
  ```sql
  SELECT * FROM users ORDER BY user_id DESC LIMIT 1;
  ```
  - [ ] `zipcode` 컬럼에 데이터 저장됨
  - [ ] `address1` 컬럼에 데이터 저장됨
  - [ ] `address2` 컬럼에 데이터 저장됨

---

## 주의사항

### 1. 주소는 선택 필드

- 사용자가 주소를 입력하지 않아도 회원가입 가능
- `?.` 연산자로 안전하게 처리됨
- 백엔드 DTO에서도 `@NotBlank` 제약이 없음 (선택 필드)

### 2. 우편번호 형식

- Daum API는 5자리 우편번호 반환 (예: `06234`)
- 백엔드 DTO는 `@Pattern(regexp = "^[0-9]{5}$")` 검증

### 3. 주소 길이 제한

- `address1`: 최대 100자 (DB 컬럼은 500자까지 가능)
- `address2`: 최대 100자 (DB 컬럼은 500자까지 가능)

### 4. 데이터 변환

- 프론트엔드 `Address` 타입과 백엔드 DTO 필드명이 다름
- 반드시 매핑 필요: `postalCode → zipcode`, `main → address1`, `detail → address2`

---

## 트러블슈팅

### 문제: 주소 데이터가 DB에 저장되지 않음

**원인**: AuthContext.tsx에서 주소 필드를 전송하지 않음

**해결**: 위의 "해결 방법" 섹션 참고하여 코드 수정

### 문제: "우편번호는 5자리 숫자여야 합니다" 에러

**원인**: 잘못된 우편번호 형식

**해결**: Daum API는 자동으로 5자리 우편번호 제공하므로 정상 작동

### 문제: Network 요청에서 주소 필드가 null로 전송됨

**원인**: 주소 선택을 하지 않음

**해결**: 정상 동작 (주소는 선택 필드). 주소 입력 시 값이 전송됨

### 문제: "주소는 100자 이하여야 합니다" 에러

**원인**: 주소가 너무 긺

**해결**:
- DTO의 `@Size(max = 100)` 제약 조건 확인
- 필요 시 제약 조건 완화 (예: `max = 200`)
- 또는 사용자에게 주소를 짧게 입력하도록 안내

---

## 다음 단계

✅ **AuthContext.tsx 수정 완료 후**:

1. **회원가입 테스트**: 주소 포함하여 회원가입 진행
2. **DB 확인**: users 테이블에 주소 데이터 저장 확인
3. **프로필 조회 테스트**: 로그인 후 마이페이지에서 주소 표시 확인
4. **프로필 수정 테스트**: 주소 수정 기능 테스트

---

## 요약

### ✅ 이미 완료된 것
- 백엔드 Entity, DTO, Service 모두 주소 필드 지원
- 프론트엔드 AddressSearch 컴포넌트 구현
- SignupForm에 주소 입력 UI 포함

### ⚠️ 수정 필요한 것
- **AuthContext.tsx**: signup 함수에서 주소 데이터를 백엔드로 전송

### 🎯 핵심 변경 사항

**단 3줄 추가**로 회원가입 시 주소 데이터가 DB에 저장됩니다:

```typescript
zipcode: userData.address?.postalCode,
address1: userData.address?.main,
address2: userData.address?.detail,
```

---

**작성자**: Claude Code
**최종 수정**: 2025-01-19
