/**
 * API 유틸리티 함수
 * @description 백엔드 API 호출을 위한 헬퍼 함수들
 */

// API 기본 URL 설정
const API_BASE_URL = "/api";

/**
 * 저장된 인증 토큰 가져오기
 * @returns accessToken 또는 sessionToken
 */
function getAuthToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("sessionToken")
  );
}

/**
 * 프로필 업데이트 요청 데이터 타입
 */
export interface UpdateProfileRequest {
  nickname?: string;
  phone?: string;
  address?: string;
  password?: string;
  profileImage?: string;
}

/**
 * 프로필 업데이트 응답 데이터 타입
 */
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    username: string;
    email: string;
    fullName?: string;
    nickname?: string;
    phone?: string;
    address?: string;
    profileImage?: string;
  };
}

/**
 * 프로필 조회 API 호출
 * @returns 사용자 프로필 정보
 * @throws 인증 실패, 네트워크 오류, 서버 오류
 */
export async function getProfile(): Promise<UpdateProfileResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.message || "프로필 조회에 실패했습니다.";
    throw new Error(errorMessage);
  }

  return result;
}

/**
 * 프로필 업데이트 API 호출
 * @param data - 업데이트할 프로필 데이터 (phone, password, profileImage)
 * @returns 업데이트된 사용자 정보
 * @throws 인증 실패, 네트워크 오류, 서버 오류
 */
export async function updateProfile(
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.message || "프로필 업데이트에 실패했습니다.";
    throw new Error(errorMessage);
  }

  return result;
}

// ==================== 냉장고 관련 API ====================

/**
 * 냉장고 재료 데이터 타입
 */
export interface FridgeItem {
  id: number;
  name: string;
  quantity: string;
  category: string;
  expiryDate?: string;
  addedAt: string;
}

/**
 * 냉장고 재료 추가 요청 데이터 타입
 */
export interface AddFridgeItemRequest {
  name: string;
  quantity: string;
  category: string;
  expiryDate?: string;
}

/**
 * 냉장고 재료 수정 요청 데이터 타입
 */
export interface UpdateFridgeItemRequest {
  name?: string;
  quantity?: string;
  category?: string;
  expiryDate?: string;
}

/**
 * 냉장고 재료 API 응답 타입
 */
export interface FridgeApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 모든 냉장고 재료 조회
 * @returns 냉장고 재료 목록
 */
export async function getAllFridgeItems(): Promise<
  FridgeApiResponse<FridgeItem[]>
> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  console.log("🔵 냉장고 재료 목록 조회 요청");

  const response = await fetch(`${API_BASE_URL}/fridge`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("🔵 응답 상태:", response.status, response.statusText);

  if (response.ok) {
    try {
      const result = await response.json();
      console.log("🔵 응답 데이터:", result);
      return result;
    } catch (e) {
      console.error("🔴 JSON 파싱 실패:", e);
      throw new Error("서버 응답을 처리하는 중 오류가 발생했습니다.");
    }
  } else {
    const errorText = await response.text();
    console.error("🔴 에러 응답 (텍스트):", errorText);
    throw new Error(
      `서버 에러: ${response.status} ${response.statusText}. 응답: ${errorText}`
    );
  }
}

/**
 * 카테고리별 냉장고 재료 조회
 * @param category - 카테고리명
 * @returns 카테고리별 재료 목록
 */
export async function getFridgeItemsByCategory(
  category: string
): Promise<FridgeApiResponse<FridgeItem[]>> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(
    `${API_BASE_URL}/fridge/category/${encodeURIComponent(category)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.message || "카테고리별 재료 조회에 실패했습니다.";
    throw new Error(errorMessage);
  }

  return result;
}

/**
 * 냉장고 재료 추가
 * @param data - 추가할 재료 데이터
 * @returns 추가된 재료 정보
 */
export async function addFridgeItem(
  data: AddFridgeItemRequest
): Promise<FridgeApiResponse<FridgeItem>> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  // 빈 문자열인 expiryDate를 undefined로 변환
  const requestData = {
    ...data,
    expiryDate:
      data.expiryDate && data.expiryDate.trim() !== ""
        ? data.expiryDate
        : undefined,
  };

  console.log("🔵 재료 추가 요청 데이터:", requestData);

  const response = await fetch(`${API_BASE_URL}/fridge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  console.log("🔵 응답 상태:", response.status, response.statusText);

  if (response.ok) {
    try {
      const result = await response.json();
      console.log("🔵 응답 데이터:", result);
      return result;
    } catch (e) {
      console.error("🔴 JSON 파싱 실패:", e);
      throw new Error("서버 응답을 처리하는 중 오류가 발생했습니다.");
    }
  } else {
    const errorText = await response.text();
    console.error("🔴 에러 응답 (텍스트):", errorText);
    throw new Error(
      `서버 에러: ${response.status} ${response.statusText}. 응답: ${errorText}`
    );
  }
}

/**
 * 냉장고 재료 수정
 * @param fridgeId - 재료 ID
 * @param data - 수정할 재료 데이터
 * @returns 수정된 재료 정보
 */
export async function updateFridgeItem(
  fridgeId: number,
  data: UpdateFridgeItemRequest
): Promise<FridgeApiResponse<FridgeItem>> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  // 빈 문자열인 expiryDate를 undefined로 변환
  const requestData = {
    ...data,
    expiryDate:
      data.expiryDate && data.expiryDate.trim() !== ""
        ? data.expiryDate
        : undefined,
  };

  const response = await fetch(`${API_BASE_URL}/fridge/${fridgeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.message || "재료 수정에 실패했습니다.";
    throw new Error(errorMessage);
  }

  return result;
}

/**
 * 냉장고 재료 삭제
 * @param fridgeId - 재료 ID
 */
export async function deleteFridgeItem(
  fridgeId: number
): Promise<FridgeApiResponse<null>> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/fridge/${fridgeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.message || "재료 삭제에 실패했습니다.";
    throw new Error(errorMessage);
  }

  return result;
}

// ==================== 레시피 관련 API ====================

/**
 * 레시피 데이터 타입
 */
export interface Recipe {
    recipeId: number;
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    cookingTime: number;
    difficulty: string;
    servings: number;
    imageUrl: string;
    likeCount: number;
    createdAt: string; // ISO 8601 형식의 문자열
    updatedAt: string; // ISO 8601 형식의 문자열
    likedByUser?: boolean;
}

/**
 * 레시피 API 응답 타입
 */
export interface RecipeApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


/**
 * 모든 레시피 조회
 * @returns 레시피 목록
 */
export async function getAllRecipes(): Promise<Recipe[]> {
    console.log("🔵 모든 레시피 조회 요청");
    const response = await fetch(`${API_BASE_URL}/recipes`);
    if (!response.ok) {
        throw new Error('레시피 목록을 불러오는 데 실패했습니다.');
    }
    return response.json();
}

/**
 * ID로 특정 레시피 조회
 * @param recipeId - 레시피 ID
 * @returns 레시피 정보
 */
export async function getRecipeById(recipeId: number): Promise<Recipe> {
    console.log(`🔵 ID ${recipeId} 레시피 조회 요청`);
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
    if (!response.ok) {
        throw new Error('레시피 정보를 불러오는 데 실패했습니다.');
    }
    return response.json();
}

/**
 * 새로운 레시피 생성
 * @param recipeData - 생성할 레시피 데이터
 * @returns 생성된 레시피 정보
 */
export async function createRecipe(recipeData: Omit<Recipe, 'recipeId' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const token = getAuthToken();
    if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
    }
    const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
    });
    if (!response.ok) {
        throw new Error('레시피 생성에 실패했습니다.');
    }
    return response.json();
}

/**
 * 레시피 수정
 * @param recipeId - 수정할 레시피 ID
 * @param recipeData - 수정할 레시피 데이터
 * @returns 수정된 레시피 정보
 */
export async function updateRecipe(recipeId: number, recipeData: Partial<Omit<Recipe, 'recipeId' | 'createdAt' | 'updatedAt'>>): Promise<Recipe> {
    const token = getAuthToken();
    if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
    }
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
    });
    if (!response.ok) {
        throw new Error('레시피 수정에 실패했습니다.');
    }
    return response.json();
}

/**
 * 레시피 삭제
 * @param recipeId - 삭제할 레시피 ID
 */
export async function deleteRecipe(recipeId: number): Promise<void> {
    const token = getAuthToken();
    if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
    }
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('레시피 삭제에 실패했습니다.');
    }
}

/**
 * 레시피 좋아요 토글
 * @param recipeId - 레시피 ID
 * @param userId - 사용자 ID
 * @returns 업데이트된 레시피 정보
 */
export async function toggleLikeRecipe(recipeId: number, userId: number): Promise<Recipe> {
    const token = getAuthToken();
    if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
    }
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/toggle-like?userId=${userId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('레시피 좋아요 처리에 실패했습니다.');
    }
    return response.json();
}

/**
 * 제목으로 레시피 검색
 * @param title - 검색할 제목
 * @returns 검색된 레시피 목록
 */
export async function searchRecipesByTitle(title: string): Promise<Recipe[]> {
    console.log(`🔵 제목 "${title}" 레시피 검색 요청`);
    const response = await fetch(`${API_BASE_URL}/recipes/search/title?title=${encodeURIComponent(title)}`);
    if (!response.ok) {
        throw new Error('레시피 검색에 실패했습니다.');
    }
    return response.json();
}

// ==================== OCR 관련 타입 및 API ====================
export interface OcrIngredient {
  name: string;
  unit: string;
  amount: number;
}

export type OcrProduct = Record<string, unknown>; // 현재는 일반 객체로 정의
export type OcrBoundingBox = Record<string, unknown>; // 현재는 일반 객체로 정의

export interface OcrResult {
  extractedText: string | null;
  totalPaymentPrice: number | null;
  boundingBoxes: OcrBoundingBox[];
  products: OcrProduct[];
  ingredients: OcrIngredient[];
}

/**
 * 영수증 OCR 처리를 위한 API 호출
 * @param file - 이미지 파일
 * @returns OCR 인식 결과
 */
export async function processReceiptOcr(file: File): Promise<OcrResult> {
  const token = getAuthToken(); // 인증 토큰 획득

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const formData = new FormData();
  formData.append('file', file); // 이미지 파일을 FormData에 추가

  const response = await fetch(`${API_BASE_URL}/users/ocr`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // 인증 헤더 포함
    },
    body: formData, // FormData 전송
  });

  if (!response.ok) {
    // HTTP 응답이 성공적이지 않을 경우 에러 처리
    if (response.status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
    throw new Error(`OCR API 호출 실패: ${response.statusText}`);
  }

  return response.json(); // JSON 형식의 OCR 결과 반환
}
