# 레시피 등록 시스템 분석 리포트

**분석 날짜**: 2025-11-24
**분석 대상**: 냉파고 프로젝트 - 레시피 등록 페이지 ↔ DB 연동 분석

---

## 📋 목차
1. [요약](#요약)
2. [프론트엔드 데이터 구조](#프론트엔드-데이터-구조)
3. [백엔드 API 구조](#백엔드-api-구조)
4. [데이터베이스 테이블 구조](#데이터베이스-테이블-구조)
5. [필드 매핑 분석](#필드-매핑-분석)
6. [문제점 및 누락 사항](#문제점-및-누락-사항)
7. [권장 해결 방안](#권장-해결-방안)

---

## 📊 요약

### ✅ 현재 상태
- **프론트엔드**: 레시피 등록 UI는 완성되어 있으나 API 호출 로직이 미구현 (TODO 상태)
- **백엔드**: RecipeController와 RecipeDTO는 구현되어 있음
- **데이터베이스**: recipes 테이블이 정상적으로 생성되어 있음

### ⚠️ 주요 문제점
1. **데이터 형식 불일치**: 프론트엔드의 배열 형태 데이터가 백엔드의 문자열 필드로 전송되지 않음
2. **타입 변환 누락**: 문자열 → 숫자 변환 로직 없음
3. **API 호출 미구현**: 실제 등록 기능이 작동하지 않음

### 🎯 결론
**현재 상태로는 레시피 등록 시 데이터가 DB에 저장되지 않습니다.**
프론트엔드에서 API 호출 로직과 데이터 변환 로직을 구현해야 합니다.

---

## 🎨 프론트엔드 데이터 구조

### RecipeFormDataType 인터페이스
```typescript
interface RecipeFormDataType {
  image: string | null;           // 레시피 대표 이미지 URL
  title: string;                  // 레시피 제목
  description: string;            // 레시피 설명
  cookTime: string;               // 조리 시간 (문자열)
  difficulty: string;             // 난이도
  servings: string;               // 인분 (문자열)
  ingredients: Ingredient[];      // 재료 배열
  steps: Step[];                  // 조리 단계 배열
}
```

### Ingredient 구조
```typescript
interface Ingredient {
  id: number;        // 고유 ID
  name: string;      // 재료명
  quantity: string;  // 수량
  unit: string;      // 단위
}
```

### Step 구조
```typescript
interface Step {
  id: number;              // 고유 ID
  description: string;     // 단계 설명
  imageUrl: string | null; // 단계별 이미지 URL
}
```

### 현재 등록 로직
```typescript
const handleRegister = () => {
  // TODO: 실제 API 호출 로직 구현
  console.log('레시피 등록 데이터:', recipeData);
  alert('레시피가 성공적으로 등록되었습니다!');
  navigate('/recipe/all');
};
```

**⚠️ 문제**: API 호출이 구현되지 않아 데이터가 서버로 전송되지 않음

---

## 🔧 백엔드 API 구조

### RecipeController - 레시피 생성 엔드포인트
```java
@PostMapping
public ResponseEntity<RecipeDTO> createRecipe(@RequestBody RecipeDTO recipeDTO) {
    log.info("레시피 생성 요청 - 제목: {}", recipeDTO.getTitle());
    Recipe recipe = recipeService.createRecipe(recipeDTO.toEntity());
    return ResponseEntity.status(HttpStatus.CREATED).body(RecipeDTO.fromEntity(recipe));
}
```

- **엔드포인트**: `POST /api/recipes`
- **요청 본문**: RecipeDTO 형식의 JSON
- **응답**: 생성된 레시피 정보 (RecipeDTO)

### RecipeDTO 구조
```java
public class RecipeDTO {
    private Long recipeId;
    private String title;           // 제목
    private String description;     // 설명
    private String ingredients;     // 재료 (문자열)
    private String instructions;    // 조리 방법 (문자열)
    private Integer cookingTime;    // 조리 시간 (정수)
    private String difficulty;      // 난이도
    private Integer servings;       // 인분 (정수)
    private String imageUrl;        // 이미지 URL
    private Integer likeCount;      // 좋아요 수
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

---

## 💾 데이터베이스 테이블 구조

### recipes 테이블
```sql
CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cooking_time INTEGER,
    difficulty VARCHAR(20),
    servings INTEGER DEFAULT 1,
    image_url VARCHAR(500),
    like_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT chk_difficulty CHECK (difficulty IN ('쉬움', '보통', '어려움')),
    CONSTRAINT chk_cooking_time CHECK (cooking_time > 0),
    CONSTRAINT chk_servings CHECK (servings > 0),
    CONSTRAINT chk_like_count CHECK (like_count >= 0)
);
```

---

## 🔍 필드 매핑 분석

### 매핑 가능 필드

| 프론트엔드 | 백엔드 DTO | DB 컬럼 | 상태 | 비고 |
|----------|-----------|---------|------|------|
| title | title | title | ✅ 정상 | 문자열, 직접 매핑 가능 |
| description | description | description | ✅ 정상 | 문자열, 직접 매핑 가능 |
| image | imageUrl | image_url | ✅ 정상 | 문자열, 직접 매핑 가능 |
| difficulty | difficulty | difficulty | ✅ 정상 | 문자열, 직접 매핑 가능 |
| - | likeCount | like_count | ✅ 자동 | DB 기본값 0 |
| - | createdAt | created_at | ✅ 자동 | DB 자동 생성 |
| - | updatedAt | updated_at | ✅ 자동 | DB 자동 생성 |

### ⚠️ 변환 필요 필드

| 프론트엔드 | 타입 | 백엔드 DTO | 타입 | 문제점 |
|----------|------|-----------|------|--------|
| cookTime | string | cookingTime | Integer | 문자열 → 정수 변환 필요 |
| servings | string | servings | Integer | 문자열 → 정수 변환 필요 |

### ❌ 구조 변환 필요 필드

| 프론트엔드 | 타입 | 백엔드 DTO | 타입 | 문제점 |
|----------|------|-----------|------|--------|
| ingredients | Ingredient[] | ingredients | String | 배열 → JSON 문자열 변환 필요 |
| steps | Step[] | instructions | String | 배열 → 텍스트 문자열 변환 필요 |

---

## ⚠️ 문제점 및 누락 사항

### 1. API 호출 미구현 (🔴 Critical)
**위치**: `frontend/src/pages/RecipeRegister/RecipeRegisterPage.tsx:66-71`

**현재 코드**:
```typescript
const handleRegister = () => {
  // TODO: 실제 API 호출 로직 구현
  console.log('레시피 등록 데이터:', recipeData);
  alert('레시피가 성공적으로 등록되었습니다!');
  navigate('/recipe/all');
};
```

**문제**:
- 실제 API 호출이 없어 데이터가 서버로 전송되지 않음
- 등록 성공 메시지만 표시되고 실제로는 아무것도 저장되지 않음

**영향**: 사용자가 레시피를 등록해도 DB에 저장되지 않음

---

### 2. ingredients 배열 → 문자열 변환 누락 (🔴 Critical)

**프론트엔드 데이터**:
```typescript
ingredients: [
  { id: 1, name: "밥", quantity: "1", unit: "공기" },
  { id: 2, name: "김치", quantity: "1/2", unit: "컵" },
  { id: 3, name: "햄", quantity: "50", unit: "g" }
]
```

**백엔드 기대 형식**:
```json
"ingredients": "밥 1공기, 김치 1/2컵, 햄 50g"
```
또는
```json
"ingredients": "[{\"name\":\"밥\",\"quantity\":\"1\",\"unit\":\"공기\"},{\"name\":\"김치\",\"quantity\":\"1/2\",\"unit\":\"컵\"}]"
```

**문제**: 배열 형태를 문자열로 변환하는 로직이 없음

**영향**: ingredients 필드가 올바르게 저장되지 않거나 에러 발생

---

### 3. steps 배열 → instructions 문자열 변환 누락 (🔴 Critical)

**프론트엔드 데이터**:
```typescript
steps: [
  { id: 1, description: "김치와 햄을 잘게 썰어주세요.", imageUrl: null },
  { id: 2, description: "달군 팬에 식용유를 두르고 김치를 볶아주세요.", imageUrl: null },
  { id: 3, description: "햄을 넣고 함께 볶아주세요.", imageUrl: null }
]
```

**백엔드 기대 형식**:
```
"instructions": "1. 김치와 햄을 잘게 썰어주세요.\n2. 달군 팬에 식용유를 두르고 김치를 볶아주세요.\n3. 햄을 넣고 함께 볶아주세요."
```

**문제**: 배열 형태를 번호가 매겨진 텍스트로 변환하는 로직이 없음

**영향**: instructions 필드가 올바르게 저장되지 않거나 에러 발생

---

### 4. 타입 변환 누락 (🟡 Important)

**cookTime**: string → Integer
```typescript
// 프론트엔드
cookTime: "30"  // 문자열

// 백엔드 필요
cookingTime: 30  // 정수
```

**servings**: string → Integer
```typescript
// 프론트엔드
servings: "2"  // 문자열

// 백엔드 필요
servings: 2  // 정수
```

**문제**: 숫자 문자열을 정수로 변환하지 않으면 타입 에러 발생 가능

---

### 5. 필드명 불일치 (🟢 Minor)

| 프론트엔드 | 백엔드 |
|----------|--------|
| cookTime | cookingTime |
| image | imageUrl |

**문제**: 필드명이 다르므로 매핑 시 변환 필요

---

## 💡 권장 해결 방안

### 1. API 호출 함수 구현

**위치**: `frontend/src/api/` 디렉토리에 새 파일 생성

**예시**: `frontend/src/api/recipeApi.ts`
```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const createRecipe = async (recipeData: any) => {
  const response = await axios.post(`${API_BASE_URL}/recipes`, recipeData);
  return response.data;
};
```

---

### 2. 데이터 변환 함수 구현

**위치**: `RecipeRegisterPage.tsx` 내부 또는 별도 유틸리티 파일

```typescript
// ingredients 배열을 문자열로 변환
const formatIngredients = (ingredients: Ingredient[]): string => {
  return ingredients
    .map(ing => `${ing.name} ${ing.quantity}${ing.unit}`)
    .join(', ');
};

// steps 배열을 instructions 문자열로 변환
const formatInstructions = (steps: Step[]): string => {
  return steps
    .map((step, index) => `${index + 1}. ${step.description}`)
    .join('\n');
};

// 전체 데이터를 백엔드 형식으로 변환
const convertToBackendFormat = (frontendData: RecipeFormDataType) => {
  return {
    title: frontendData.title,
    description: frontendData.description,
    ingredients: formatIngredients(frontendData.ingredients),
    instructions: formatInstructions(frontendData.steps),
    cookingTime: parseInt(frontendData.cookTime) || null,
    difficulty: frontendData.difficulty,
    servings: parseInt(frontendData.servings) || 1,
    imageUrl: frontendData.image
  };
};
```

---

### 3. handleRegister 함수 업데이트

```typescript
const handleRegister = async () => {
  try {
    // 프론트엔드 데이터를 백엔드 형식으로 변환
    const backendData = convertToBackendFormat(recipeData);

    // API 호출
    const response = await createRecipe(backendData);

    // 성공 처리
    alert('레시피가 성공적으로 등록되었습니다!');
    navigate('/recipe/all');
  } catch (error) {
    console.error('레시피 등록 실패:', error);
    alert('레시피 등록 중 오류가 발생했습니다.');
  }
};
```

---

### 4. 검증 로직 추가 (선택사항)

```typescript
const validateRecipeData = (data: RecipeFormDataType): boolean => {
  // 필수 필드 검증
  if (!data.title.trim()) {
    alert('레시피 제목을 입력해주세요.');
    return false;
  }

  if (!data.cookTime || parseInt(data.cookTime) <= 0) {
    alert('유효한 조리 시간을 입력해주세요.');
    return false;
  }

  if (!data.difficulty) {
    alert('난이도를 선택해주세요.');
    return false;
  }

  if (data.ingredients.length === 0 || !data.ingredients[0].name) {
    alert('최소 1개 이상의 재료를 입력해주세요.');
    return false;
  }

  if (data.steps.length === 0 || !data.steps[0].description) {
    alert('최소 1개 이상의 조리 단계를 입력해주세요.');
    return false;
  }

  return true;
};

const handleRegister = async () => {
  // 검증
  if (!validateRecipeData(recipeData)) {
    return;
  }

  try {
    const backendData = convertToBackendFormat(recipeData);
    const response = await createRecipe(backendData);
    alert('레시피가 성공적으로 등록되었습니다!');
    navigate('/recipe/all');
  } catch (error) {
    console.error('레시피 등록 실패:', error);
    alert('레시피 등록 중 오류가 발생했습니다.');
  }
};
```

---

## 📝 구현 체크리스트

### 필수 구현 사항
- [ ] API 호출 함수 작성 (`recipeApi.ts`)
- [ ] ingredients 배열 → 문자열 변환 함수
- [ ] steps 배열 → instructions 문자열 변환 함수
- [ ] 타입 변환 (string → Integer)
- [ ] handleRegister 함수에 실제 API 호출 로직 추가
- [ ] 에러 처리 (try-catch)

### 선택 구현 사항
- [ ] 입력 데이터 검증 로직
- [ ] 로딩 상태 표시
- [ ] 이미지 업로드 기능 (현재는 URL만 입력)
- [ ] 등록 성공/실패 토스트 메시지
- [ ] 중복 등록 방지 (버튼 비활성화)

---

## 🎯 최종 결론

### 현재 상태
**❌ 레시피 등록 시 데이터가 DB에 전송되지 않습니다.**

### 주요 원인
1. API 호출 로직이 구현되지 않음 (TODO 상태)
2. 데이터 형식 변환 로직 누락 (배열 → 문자열, 문자열 → 숫자)
3. 필드명 매핑 누락 (cookTime → cookingTime, image → imageUrl)

### 해결 방법
위에 제시된 3가지 핵심 함수를 구현하면 정상적으로 작동합니다:
1. `convertToBackendFormat()` - 데이터 형식 변환
2. `createRecipe()` - API 호출
3. `handleRegister()` 업데이트 - 실제 등록 로직

### 예상 작업 시간
- **기본 구현**: 30분 ~ 1시간
- **검증 및 테스트 포함**: 1 ~ 2시간

---

**분석 완료**
추가 질문이나 구현 지원이 필요하시면 말씀해주세요.
