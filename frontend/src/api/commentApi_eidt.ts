const API_BASE_URL = '/api'; // vite.config.ts의 프록시 설정을 사용합니다.

// 인증 토큰 가져오기 함수 (recipeReviewApi.ts와 동일하게)
function getAuthToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("sessionToken")
  );
}

export interface ApiComment {
  commentId: number;
  userId: number;
  recipeId: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  userNickname: string;
  userProfileImage?: string;
  recipeTitle?: string;
  recipeImageUrl?: string;
}

// 특정 레시피의 댓글 목록 조회
export const getCommentsByRecipeId = async (recipeId: number): Promise<ApiComment[]> => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments`);
  if (!response.ok) {
    throw new Error('댓글 목록을 불러오는 데 실패했습니다.');
  }
  return response.json();
};

// 댓글 생성
export const createComment = async (recipeId: number, content: string): Promise<ApiComment> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('로그인 후 댓글을 작성할 수 있습니다.');
  }
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('댓글 작성에 실패했습니다.');
  }
  return response.json();
};

// 댓글 수정
export const updateComment = async (recipeId: number, commentId: number, content: string): Promise<ApiComment> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('로그인 후 댓글을 수정할 수 있습니다.');
  }
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('댓글 수정에 실패했습니다.');
  }
  return response.json();
};

// 댓글 삭제
export const deleteComment = async (recipeId: number, commentId: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('로그인 후 댓글을 삭제할 수 있습니다.');
  }
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error('댓글 삭제에 실패했습니다.');
  }
  // DELETE 요청은 보통 내용이 없으므로, response.json() 호출은 생략합니다.
};

// 특정 사용자의 댓글 목록 조회
export const getCommentsByUserId = async (userId: number): Promise<ApiComment[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('로그인 후 댓글을 조회할 수 있습니다.');
  }
  const response = await fetch(`${API_BASE_URL}/comments/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('사용자 댓글 목록을 불러오는 데 실패했습니다.');
  }
  return response.json();
};
