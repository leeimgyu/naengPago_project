import type {
  Notice,
  NoticeCreateRequest,
  NoticeUpdateRequest,
  NoticeListResponse,
  NoticeSearchParams,
  NoticeDeleteResponse,
} from "@/types/notice";

const API_BASE_URL = "/api/notices";

/**
 * 토큰 가져오기 헬퍼 함수
 */
const getAuthToken = (): string | null => {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("sessionToken")
  );
};

/**
 * 인증 헤더 생성 헬퍼 함수
 */
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};

/**
 * API 에러 핸들링 헬퍼 함수
 */
const handleApiError = (error: any): string => {
  if (error instanceof Response) {
    switch (error.status) {
      case 400:
        return "잘못된 요청입니다.";
      case 401:
        return "인증이 필요합니다.";
      case 403:
        return "권한이 없습니다.";
      case 404:
        return "공지사항을 찾을 수 없습니다.";
      case 500:
        return "서버 오류가 발생했습니다.";
      default:
        return "알 수 없는 오류가 발생했습니다.";
    }
  }
  return "네트워크 오류가 발생했습니다.";
};

/**
 * 공지사항 목록 조회
 * @param params 검색 및 페이지네이션 파라미터
 * @returns 공지사항 목록 응답
 */
export const getNotices = async (
  params: NoticeSearchParams = {}
): Promise<NoticeListResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());

  // '구분' 검색 시 keyword를 category 파라미터로 전달
  if (params.searchType === "구분") {
    if (params.keyword) queryParams.append("category", params.keyword);
  } else {
    // 일반 검색 (제목, 내용, 제목+내용)
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.searchType) queryParams.append("searchType", params.searchType);
  }

  const url = `${API_BASE_URL}?${queryParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorMessage = handleApiError(response);
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * 공지사항 상세 조회
 * @param id 공지사항 ID
 * @returns 공지사항 상세 정보
 */
export const getNoticeById = async (id: number): Promise<Notice> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    const errorMessage = handleApiError(response);
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * 공지사항 등록
 * @param data 공지사항 등록 데이터
 * @returns 등록된 공지사항 정보
 */
export const createNotice = async (
  data: NoticeCreateRequest
): Promise<Notice> => {
  const formData = new FormData();
  formData.append("category", data.category);
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("isPinned", data.isPinned.toString());

  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  }

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorMessage = handleApiError(response);
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * 공지사항 수정
 * @param id 공지사항 ID
 * @param data 공지사항 수정 데이터
 * @returns 수정된 공지사항 정보
 */
export const updateNotice = async (
  id: number,
  data: NoticeUpdateRequest
): Promise<Notice> => {
  const formData = new FormData();
  formData.append("category", data.category);
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("isPinned", data.isPinned.toString());

  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorMessage = handleApiError(response);
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * 공지사항 삭제
 * @param id 공지사항 ID
 * @returns 삭제 결과
 */
export const deleteNotice = async (
  id: number
): Promise<NoticeDeleteResponse> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorMessage = handleApiError(response);
    throw new Error(errorMessage);
  }

  // 204 No Content - 응답 body 없음
  return { success: true, message: "공지사항이 삭제되었습니다." };
};

/**
 * 공지사항 조회수 증가
 * @param id 공지사항 ID
 * @returns 업데이트된 공지사항 정보
 */
export const incrementNoticeViews = async (id: number): Promise<Notice> => {
  const response = await fetch(`${API_BASE_URL}/${id}/views`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorMessage = handleApiError(response);
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * 날짜가 1일 이내인지 확인하여 isNew 플래그 설정
 * @param dateString ISO 8601 날짜 문자열
 * @returns 1일 이내 여부
 */
export const isWithinOneDay = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 1;
};

/**
 * 조회수를 포맷팅 (예: 1234 -> "1,234")
 * @param views 조회수
 * @returns 포맷팅된 조회수 문자열
 */
export const formatViews = (views: number): string => {
  return views.toLocaleString("ko-KR");
};

/**
 * ISO 8601 날짜를 한국 형식으로 변환 (예: "2025.01.15")
 * @param isoDate ISO 8601 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

/**
 * 최신 공지사항 목록 조회 (알림용)
 * @param limit 조회할 개수 (기본값: 5)
 * @returns 최신 공지사항 배열
 */
export const getRecentNotices = async (
  limit: number = 5
): Promise<Notice[]> => {
  const params = new URLSearchParams();
  params.append("page", "0"); // 백엔드는 0-based 인덱싱 (0 = 첫 번째 페이지)
  params.append("pageSize", limit.toString());

  const url = `${API_BASE_URL}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorMessage = handleApiError(response);
    throw new Error(errorMessage);
  }

  const result: NoticeListResponse = await response.json();

  // isNew 플래그 설정 (7일 이내 작성된 공지사항)
  return result.notices.map((notice) => ({
    ...notice,
    isNew: isWithinSevenDays(notice.createdAt),
  }));
};

/**
 * 날짜가 7일 이내인지 확인
 * @param dateString ISO 8601 날짜 문자열
 * @returns 7일 이내 여부
 */
export const isWithinSevenDays = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};
