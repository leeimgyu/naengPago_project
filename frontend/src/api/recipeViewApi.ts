const API_BASE_URL = '/api';

function getAuthToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("sessionToken")
  );
}

export interface RecipeView {
  viewId: number;
  userId: number;
  recipeId: number;
  recipeTitle: string;
  recipeDescription: string;
  recipeImageUrl: string;
  recipeDifficulty: string;
  recipeCookingTime: number;
  recipeLikeCount: number;
  recipeViewCount: number;
  viewedAt: string;
  createdAt: string;
}

/**
 * 레시피 조회 이력 저장
 * 사용자가 레시피를 조회할 때 호출
 */
export const recordRecipeView = async (recipeId: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/recipe-views?recipeId=${recipeId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('레시피 조회 이력 저장에 실패했습니다');
  }
};

/**
 * 사용자의 최근 조회 레시피 목록 조회 (중복 제거)
 * limit: 가져올 최대 개수 (기본값: 10)
 */
export const getRecentViewedRecipes = async (limit: number = 10): Promise<RecipeView[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/recipe-views/recent?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('최근 조회 레시피를 불러오는데 실패했습니다');
  }

  return response.json();
};

/**
 * 사용자의 모든 조회 이력 조회 (중복 포함)
 */
export const getAllViewHistories = async (): Promise<RecipeView[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/recipe-views`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('조회 이력을 불러오는데 실패했습니다');
  }

  return response.json();
};

/**
 * 사용자의 조회 이력 삭제
 */
export const deleteViewHistory = async (): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/recipe-views`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('조회 이력 삭제에 실패했습니다');
  }
};
