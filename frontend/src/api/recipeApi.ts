const API_BASE_URL = "/api";
// API_BASE_URL_V1은 이제 사용되지 않으므로 제거합니다.

// --- 백엔드에서 오는 조리 단계 타입 ---
export interface BackendCookingStep {
  step: number;
  description: string;
  imageUrl?: string;
}

// --- 새로운 통합 레시피 타입 정의 (UnifiedRecipeDTO에 해당) ---
export interface UnifiedRecipe {
  id: string; // DB ID와 API ID 모두 문자열로 처리
  dbId?: number; // 통합된 내부 DB ID (리뷰, 댓글용)
  source: "db" | "api";
  title: string;
  imageUrl: string;
  description: string;
  ingredients: string;
  instructions: string; // 이 속성은 cookingSteps로 대체될 수 있습니다.
  cookingSteps?: BackendCookingStep[]; // 새로운 조리 단계 배열
  infoWgt?: string;
  likeCount: number;
  viewCount: number;
  userId?: number;
  author: string;
  nickname?: string; // nickname 필드 추가

  // For debugging category filter
  rcpPat2?: string;
  rcpWay2?: string;
}

// --- 레시피 생성/수정 요청을 위한 새로운 타입 정의 (RecipeRequestDTO에 해당) ---
export interface RecipeRequest {
  rcpNm: string;
  rcpWay2?: string;
  rcpPat2?: string;
  rcpPartsDtls?: string;
  hashTag?: string;
  rcpNaTip?: string;
  attFileNoMain?: string;
  attFileNoMk?: string;
  infoEng?: string;
  infoCar?: string;
  infoPro?: string;
  infoFat?: string;
  infoNa?: string;
  infoWgt?: string;

  manual01?: string;
  manual02?: string;
  manual03?: string;
  manual04?: string;
  manual05?: string;
  manual06?: string;
  manual07?: string;
  manual08?: string;
  manual09?: string;
  manual10?: string;
  manual11?: string;
  manual12?: string;
  manual13?: string;
  manual14?: string;
  manual15?: string;
  manual16?: string;
  manual17?: string;
  manual18?: string;
  manual19?: string;
  manual20?: string;

  manualImg01?: string;
  manualImg02?: string;
  manualImg03?: string;
  manualImg04?: string;
  manualImg05?: string;
  manualImg06?: string;
  manualImg07?: string;
  manualImg08?: string;
  manualImg09?: string;
  manualImg10?: string;
  manualImg11?: string;
  manualImg12?: string;
  manualImg13?: string;
  manualImg14?: string;
  manualImg15?: string;
  manualImg16?: string;
  manualImg17?: string;
  manualImg18?: string;
  manualImg19?: string;
  manualImg20?: string;
}

// --- 모든 통합 레시피 조회 함수 (getAllRecipes로 대체) ---
export const getAllRecipes = async (): Promise<UnifiedRecipe[]> => {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) {
    throw new Error("레시피 목록을 불러오는데 실패했습니다");
  }
  return response.json();
};

// 레시피 ID로 조회
export const getRecipeById = async (recipeId: number): Promise<UnifiedRecipe> => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
  if (!response.ok) {
    throw new Error("레시피를 불러오는데 실패했습니다");
  }
  return response.json();
};

// 인기 레시피 조회
export const getPopularRecipes = async (limit: number = 10): Promise<UnifiedRecipe[]> => {
  const response = await fetch(
    `${API_BASE_URL}/recipes/popular?limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("인기 레시피를 불러오는데 실패했습니다");
  }
  return response.json();
};

// 최신 레시피 조회
export const getLatestRecipes = async ( limit: number = 10): Promise<UnifiedRecipe[]> => {
  const response = await fetch(`${API_BASE_URL}/recipes/latest?limit=${limit}`);
  if (!response.ok) {
    throw new Error("최신 레시피를 불러오는데 실패했습니다");
  }
  return response.json();
};

// 제목으로 레시피 검색
export const searchRecipesByTitle = async (title: string): Promise<UnifiedRecipe[]> => {
  const encodedTitle = encodeURIComponent(title);
  const response = await fetch(
    `${API_BASE_URL}/recipes/search/title?title=${encodedTitle}`
  );
  if (!response.ok) {
    throw new Error("레시피 검색에 실패했습니다");
  }
  return response.json();
};

// 난이도로 레시피 검색
export const searchRecipesByDifficulty = async ( difficulty: string): Promise<UnifiedRecipe[]> => {
  const encodedDifficulty = encodeURIComponent(difficulty);
  const response = await fetch(
    `${API_BASE_URL}/recipes/search/difficulty?difficulty=${encodedDifficulty}`
  );
  if (!response.ok) {
    throw new Error("레시피 검색에 실패했습니다");
  }
  return response.json();
};

// 재료로 레시피 검색
export const searchRecipesByIngredient = async ( ingredient: string): Promise<UnifiedRecipe[]> => {
  const encodedIngredient = encodeURIComponent(ingredient);
  const response = await fetch(
    `${API_BASE_URL}/recipes/search/ingredient?ingredient=${encodedIngredient}`
  );
  if (!response.ok) {
    throw new Error("레시피 검색에 실패했습니다");
  }
  return response.json();
};

// --- 페이지네이션 응답을 위한 타입 ---
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// --- 통합 검색 함수 ---
export const searchRecipes = async (params: {
  keyword?: string;
  rcpPat2?: string;
  page?: number;
  size?: number;
}): Promise<Page<UnifiedRecipe>> => {
  const { keyword, rcpPat2, page, size } = params;
  const queryParams = new URLSearchParams();

  if (keyword) queryParams.append("keyword", keyword);
  if (rcpPat2) queryParams.append("rcpPat2", rcpPat2);
  if (page) queryParams.append("page", page.toString());
  if (size) queryParams.append("size", size.toString());

  const response = await fetch(
    `${API_BASE_URL}/recipes/search?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("레시피 검색에 실패했습니다");
  }

  return response.json();
};

// 레시피 좋아요 토글 (인증 필요)
export const toggleRecipeLike = async (recipeId: number): Promise<UnifiedRecipe> => {
  // userId는 백엔드에서 userPrincipal로 처리
  const token = getAuthToken();

  if (!token) {
    throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
  }

  const response = await fetch(
    `${API_BASE_URL}/recipes/${recipeId}/toggle-like`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
    throw new Error("좋아요 처리에 실패했습니다");
  }

  return response.json();
};

// 사용자가 레시피에 좋아요를 했는지 확인
export const isRecipeLikedByUser = async (recipeId: number): Promise<boolean> => {
  // userId는 백엔드에서 userPrincipal로 처리
  const token = getAuthToken(); // 인증이 필요한 엔드포인트라고 가정

  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/is-liked`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("좋아요 여부 확인에 실패했습니다");
  }
  return response.json();
};

// 사용자가 좋아요한 레시피 목록 조회
export const getLikedRecipesByUser = async (): Promise<UnifiedRecipe[]> => {
  // userId는 백엔드에서 userPrincipal로 처리
  const token = getAuthToken(); // 인증이 필요한 엔드포인트라고 가정

  const response = await fetch(`${API_BASE_URL}/recipes/liked`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("좋아요한 레시피 목록을 불러오는데 실패했습니다");
  }
  return response.json();
};

import { getAuthToken } from "../utils/auth";

// 레시피 생성
export const createRecipe = async (recipeData: RecipeRequest): Promise<UnifiedRecipe> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipeData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
    throw new Error("레시피 등록에 실패했습니다");
  }

  return response.json();
};

// 레시피 수정
export const updateRecipe = async (recipeId: number, recipeData: RecipeRequest): Promise<UnifiedRecipe> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipeData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
    throw new Error("레시피 수정에 실패했습니다");
  }

  return response.json();
};

// 레시피 삭제
export const deleteRecipe = async (recipeId: number): Promise<void> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("로그인이 필요합니다. 먼저 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
    throw new Error("레시피 삭제에 실패했습니다");
  }
};

// --- Open API 레시피 응답 타입 ---
export interface ApiRecipe {
  RCP_NM: string;
  RCP_SEQ: string;
  ATT_FILE_NO_MAIN: string;
  [key: string]: string; // 기타 모든 문자열 기반 필드
}

export interface RecipeResponse {
  COOKRCP01: {
    total_count: string;
    row: ApiRecipe[];
    RESULT: {
      MSG: string;
      CODE: string;
    };
  };
}

// 주간 추천 레시피 조회 (OpenAPI)
export const getWeeklyRecommendedRecipes =
  async (): Promise<RecipeResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/recipes/weekly-recommendation`
    );
    if (!response.ok) {
      throw new Error("주간 추천 레시피를 불러오는데 실패했습니다");
    }
    return response.json();
  };

// rcpNm으로 DB 레시피 ID를 조회하거나, 없으면 생성 후 ID 반환
export const getOrCreateRecipeIdFromOpenApi = async (rcpNm: string): Promise<number> => {
  const encodedRcpNm = encodeURIComponent(rcpNm);
  const response = await fetch(`${API_BASE_URL}/recipes/id-by-name?rcpNm=${encodedRcpNm}`);
  
  if (!response.ok) {
    throw new Error(`'${rcpNm}'에 대한 레시피 ID를 가져오는데 실패했습니다.`);
  }
  
  // 백엔드에서 Long으로 반환된 ID를 숫자로 변환
  const data = await response.json();
  return Number(data);
};
