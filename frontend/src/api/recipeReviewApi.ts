const API_BASE_URL = '/api'; 

function getAuthToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("sessionToken")
  );
}

export interface Review {
    reviewId: number;
    userId: number;
    userNickname: string;
    recipeId: number;
    recipeTitle?: string; // 레시피 제목
    recipeImageUrl?: string; // 레시피 이미지
    rating: number;
    comment: string;
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
    profileImageUrl?: string;
}

export interface CreateReviewData {
    recipeId: number;
    userId: number;
    rating: number;
    comment: string;
}

export interface UpdateReviewData {
    rating: number;
    comment: string;
}

/**
 * 특정 레시피의 모든 후기 조회
 * @param recipeId - 레시피 ID
 * @returns 해당 레시피의 모든 후기 목록
 */
export const getReviewsByRecipeId = async (recipeId: number): Promise<Review[]> => {
    console.log(` 레시피 ID ${recipeId} 후기 목록 조회 요청`);
    const response = await fetch(`${API_BASE_URL}/reviews/recipe/${recipeId}`);
    if (!response.ok) {
        throw new Error('리뷰 목록을 불러오는데 실패했습니다.');
    }
    return await response.json();
};

/**
 * 레시피에 후기 작성 (인증 필요)
 * @param reviewData - 작성할 리뷰 데이터
 * @returns 생성된 리뷰 정보
 */
export const addReview = async (reviewData: CreateReviewData): Promise<Review> => {
    console.log(`레시피 ID ${reviewData.recipeId}에 대한 후기 작성 요청 (사용자 ID: ${reviewData.userId})`);
    const token = getAuthToken();
    if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
    }

    const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: '리뷰 작성에 실패했습니다.' }));
        throw new Error(errorBody.message);
    }
    return response.json();
};

/**
 * 레시피 리뷰 수정 (인증 필요)
 * @param reviewId - 수정할 리뷰 ID
 * @param reviewData - 수정할 리뷰 데이터
 * @returns 수정된 리뷰 정보
 */
export const updateReview = async (reviewId: number, reviewData: UpdateReviewData): Promise<Review> => {
    console.log(`리뷰 ID ${reviewId} 수정 요청`);
    const token = getAuthToken();
    if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
    }

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: '리뷰 수정에 실패했습니다.' }));
        throw new Error(errorBody.message);
    }
    return response.json();
};

/**
 * 레시피 리뷰 삭제 (인증 필요)
 * @param reviewId - 삭제할 리뷰 ID
 * @returns 삭제 성공 메시지
 */
export const deleteReview = async (reviewId: number): Promise<{ message: string }> => {
    console.log(`리뷰 ID ${reviewId} 삭제 요청`);
    const token = getAuthToken();
    if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
    }

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: '리뷰 삭제에 실패했습니다.' }));
        throw new Error(errorBody.message);
    }
    return response.json();
};

/**
 * 특정 사용자가 작성한 모든 후기 조회
 * @param userId - 사용자 ID
 * @returns 해당 사용자가 작성한 모든 후기 목록
 */
export const getReviewsByUserId = async (userId: number): Promise<Review[]> => {
    console.log(`📝 사용자 ID ${userId} 후기 목록 조회 요청`);
    const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`);
    if (!response.ok) {
        throw new Error('사용자 후기 목록을 불러오는데 실패했습니다.');
    }
    const reviews = await response.json();
    console.log(`✅ 사용자 후기 목록 조회 성공:`, reviews.length, '개');
    return reviews;
};

