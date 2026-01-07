const API_BASE_URL = "http://localhost:8080/api";

// 냉장고 재료 타입 정의
export interface FridgeItem {
  id: number;
  name: string;
  quantity: string;
  category: string;
  expiryDate: string; // ISO 형식 날짜 문자열 (예: "2025-01-20")
  addedAt: string;
}

// 유통기한 임박 재료 타입 (추가 정보 포함)
export interface ExpiringItem extends FridgeItem {
  daysRemaining: number; // 남은 일수
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 사용자의 모든 냉장고 재료 조회
 */
export async function getAllFridgeItems(token: string): Promise<FridgeItem[]> {
  const response = await fetch(`${API_BASE_URL}/fridge`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("냉장고 재료 목록을 불러올 수 없습니다.");
  }

  const result: ApiResponse<FridgeItem[]> = await response.json();
  return result.data;
}

/**
 * 유통기한 임박 재료 조회 (D-7 이내)
 */
export async function getExpiringItems(token: string): Promise<ExpiringItem[]> {
  const response = await fetch(`${API_BASE_URL}/users/fridge/expiring`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("유통기한 임박 재료를 불러올 수 없습니다.");
  }

  const result: ApiResponse<FridgeItem[]> = await response.json();

  // 남은 일수 계산하여 ExpiringItem으로 변환
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return result.data.map((item) => {
    const expiryDate = new Date(item.expiryDate);
    expiryDate.setHours(0, 0, 0, 0);

    const daysRemaining = Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      ...item,
      daysRemaining,
    };
  });
}

// 추천 레시피 타입 정의
export interface RecommendedRecipe {
  recipeId: number;
  title: string;
  imageUrl: string;
  cookingTime: number | null;
  difficulty: string;
  matchedIngredients: string[];
}

/**
 * 사용자 냉장고 재료 기반 추천 레시피 조회
 */
export async function getRecommendedRecipesByFridge(
  token: string,
  limit: number = 5
): Promise<RecommendedRecipe[]> {
  const response = await fetch(
    `${API_BASE_URL}/recipes/recommendations/fridge?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("추천 레시피를 불러올 수 없습니다.");
  }

  const result: RecommendedRecipe[] = await response.json();
  return result;
}

// 사용자의 모든 냉장고 재료 이름만 조회
export async function getFridgeIngredientNames(
  token: string
): Promise<string[]> {
  const allItems = await getAllFridgeItems(token);
  return allItems.map((item) => item.name);
}
