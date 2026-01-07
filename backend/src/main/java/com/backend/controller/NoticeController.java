package com.backend.controller;

import com.backend.dto.NoticeDTO;
import com.backend.dto.NoticeListResponse;
import com.backend.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NoticeController {

    private final NoticeService noticeService;

    /**
     * 공지사항 목록 조회
     *
     * @param page 페이지 번호 (0부터 시작, 기본값: 0)
     * @param pageSize 페이지 크기 (기본값: 10)
     * @param keyword 검색 키워드 (선택)
     * @param searchType 검색 타입 (title, content, titleOrContent - 기본값: titleOrContent)
     * @param category 카테고리 필터 (선택)
     * @return 페이지네이션된 공지사항 목록
     */
    @GetMapping
    public ResponseEntity<NoticeListResponse> getNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "titleOrContent") String searchType,
            @RequestParam(required = false) String category) {
        log.info("공지사항 목록 조회 요청 - page: {}, pageSize: {}, keyword: {}, searchType: {}, category: {}",
                page, pageSize, keyword, searchType, category);

        Pageable pageable = PageRequest.of(page, pageSize);
        NoticeListResponse response = noticeService.getNotices(keyword, searchType, category, pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * 공지사항 상세 조회
     *
     * @param id 공지사항 ID
     * @return 공지사항 상세 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<NoticeDTO> getNoticeById(@PathVariable Long id) {
        log.info("공지사항 상세 조회 요청 - ID: {}", id);

        NoticeDTO notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(notice);
    }

    /**
     * 공지사항 생성
     *
     * @param category 카테고리
     * @param title 제목
     * @param content 내용
     * @param isPinned 고정 여부 (기본값: false)
     * @param attachments 첨부 파일 목록 (선택)
     * @return 생성된 공지사항
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NoticeDTO> createNotice(
            @RequestParam String category,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false, defaultValue = "false") Boolean isPinned,
            @RequestParam(required = false) List<MultipartFile> attachments) {
        log.info("공지사항 생성 요청 - 제목: {}, 카테고리: {}", title, category);

        NoticeDTO noticeDTO = NoticeDTO.builder()
                .category(category)
                .title(title)
                .content(content)
                .isPinned(isPinned)
                .build();

        NoticeDTO createdNotice = noticeService.createNotice(noticeDTO, attachments);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNotice);
    }

    /**
     * 공지사항 수정
     *
     * @param id 공지사항 ID
     * @param category 카테고리
     * @param title 제목
     * @param content 내용
     * @param isPinned 고정 여부
     * @param attachments 새로 추가할 첨부 파일 목록 (선택)
     * @return 수정된 공지사항
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NoticeDTO> updateNotice(
            @PathVariable Long id,
            @RequestParam String category,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false, defaultValue = "false") Boolean isPinned,
            @RequestParam(required = false) List<MultipartFile> attachments) {
        log.info("공지사항 수정 요청 - ID: {}, 제목: {}", id, title);

        NoticeDTO noticeDTO = NoticeDTO.builder()
                .category(category)
                .title(title)
                .content(content)
                .isPinned(isPinned)
                .build();

        NoticeDTO updatedNotice = noticeService.updateNotice(id, noticeDTO, attachments);
        return ResponseEntity.ok(updatedNotice);
    }

    /**
     * 공지사항 삭제
     *
     * @param id 공지사항 ID
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        log.info("공지사항 삭제 요청 - ID: {}", id);

        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 공지사항 조회수 증가
     *
     * @param id 공지사항 ID
     * @return 업데이트된 공지사항
     */
    @PostMapping("/{id}/views")
    public ResponseEntity<NoticeDTO> incrementViews(@PathVariable Long id) {
        log.info("공지사항 조회수 증가 요청 - ID: {}", id);

        NoticeDTO notice = noticeService.incrementViews(id);
        return ResponseEntity.ok(notice);
    }
}
