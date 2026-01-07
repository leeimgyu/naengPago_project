package com.backend.service;

import com.backend.dto.NoticeDTO;
import com.backend.dto.NoticeListResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface NoticeService {

    /**
     * 공지사항 목록 조회 (검색, 필터, 페이지네이션)
     *
     * @param keyword 검색 키워드 (선택)
     * @param searchType 검색 타입 (title, content, titleOrContent)
     * @param category 카테고리 필터 (선택)
     * @param pageable 페이지 정보
     * @return 페이지네이션된 공지사항 목록
     */
    NoticeListResponse getNotices(String keyword, String searchType, String category, Pageable pageable);

    /**
     * 공지사항 상세 조회
     *
     * @param id 공지사항 ID
     * @return 공지사항 상세 정보
     */
    NoticeDTO getNoticeById(Long id);

    /**
     * 공지사항 생성
     *
     * @param noticeDTO 생성할 공지사항 데이터
     * @param attachments 첨부 파일 목록 (선택)
     * @return 생성된 공지사항
     */
    NoticeDTO createNotice(NoticeDTO noticeDTO, List<MultipartFile> attachments);

    /**
     * 공지사항 수정
     *
     * @param id 수정할 공지사항 ID
     * @param noticeDTO 수정할 공지사항 데이터
     * @param attachments 첨부 파일 목록 (선택)
     * @return 수정된 공지사항
     */
    NoticeDTO updateNotice(Long id, NoticeDTO noticeDTO, List<MultipartFile> attachments);

    /**
     * 공지사항 삭제
     *
     * @param id 삭제할 공지사항 ID
     */
    void deleteNotice(Long id);

    /**
     * 공지사항 조회수 증가
     *
     * @param id 공지사항 ID
     * @return 업데이트된 공지사항
     */
    NoticeDTO incrementViews(Long id);
}
