// 공지사항 타입 정의

export interface Notice {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;  // ISO 8601 형식: "2025-01-15T09:00:00Z"
  views: number;
  content: string;
  isPinned: boolean;
  isNew?: boolean;  // 클라이언트에서 계산 (작성일 기준 7일 이내)
  createdAt: string;
  updatedAt: string | null;
  attachments?: NoticeAttachment[];
}

export interface NoticeAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface NoticeCreateRequest {
  category: string;
  title: string;
  content: string;
  isPinned: boolean;
  attachments?: File[];
}

export interface NoticeUpdateRequest {
  category: string;
  title: string;
  content: string;
  isPinned: boolean;
  attachments?: File[];
}

export interface NoticeListResponse {
  notices: Notice[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface NoticeSearchParams {
  keyword?: string;
  category?: string;
  searchType?: '제목' | '내용' | '제목+내용' | '구분';
  page?: number;
  pageSize?: number;
}

export interface NoticeDeleteResponse {
  success: boolean;
  message: string;
}
