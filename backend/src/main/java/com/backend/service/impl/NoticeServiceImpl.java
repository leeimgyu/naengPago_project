package com.backend.service.impl;

import com.backend.dto.NoticeDTO;
import com.backend.dto.NoticeListResponse;
import com.backend.entity.Notice;
import com.backend.entity.NoticeAttachment;
import com.backend.repository.NoticeRepository;
import com.backend.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;

    @Value("${file.upload.notice-path:uploads/notices}")
    private String uploadPath;

    @Value("${file.upload.base-url:http://localhost:8080/files}")
    private String baseUrl;

    @Override
    public NoticeListResponse getNotices(String keyword, String searchType, String category, Pageable pageable) {
        log.debug("공지사항 목록 조회 - keyword: {}, searchType: {}, category: {}", keyword, searchType, category);

        Page<Notice> noticePage;

        // 카테고리 필터 + 검색 조합
        if (StringUtils.hasText(category)) {
            if (StringUtils.hasText(keyword)) {
                noticePage = getNoticePageByCategoryAndKeyword(category, keyword, searchType, pageable);
            } else {
                noticePage = noticeRepository.findByCategoryOrderByPinnedAndCreatedAt(category, pageable);
            }
        } else {
            if (StringUtils.hasText(keyword)) {
                noticePage = getNoticePageByKeyword(keyword, searchType, pageable);
            } else {
                noticePage = noticeRepository.findAllOrderByPinnedAndCreatedAt(pageable);
            }
        }

        return NoticeListResponse.fromPage(noticePage);
    }

    @Override
    public NoticeDTO getNoticeById(Long id) {
        log.debug("공지사항 조회 - ID: {}", id);
        Notice notice = findNoticeById(id);
        return NoticeDTO.fromEntity(notice);
    }

    @Override
    @Transactional
    public NoticeDTO createNotice(NoticeDTO noticeDTO, List<MultipartFile> attachments) {
        log.debug("공지사항 생성 - 제목: {}", noticeDTO.getTitle());

        // DTO → Entity 변환
        Notice notice = noticeDTO.toEntity();

        // 첨부파일 처리
        if (attachments != null && !attachments.isEmpty()) {
            List<NoticeAttachment> noticeAttachments = processAttachments(attachments, notice);
            noticeAttachments.forEach(notice::addAttachment);
        }

        // 저장
        Notice savedNotice = noticeRepository.save(notice);

        return NoticeDTO.fromEntity(savedNotice);
    }

    @Override
    @Transactional
    public NoticeDTO updateNotice(Long id, NoticeDTO noticeDTO, List<MultipartFile> attachments) {
        log.debug("공지사항 수정 - ID: {}", id);

        Notice existingNotice = findNoticeById(id);

        // 수정 가능한 필드 업데이트
        existingNotice.setCategory(noticeDTO.getCategory());
        existingNotice.setTitle(noticeDTO.getTitle());
        existingNotice.setContent(noticeDTO.getContent());
        existingNotice.setIsPinned(noticeDTO.getIsPinned());

        // 새로운 첨부파일 추가
        if (attachments != null && !attachments.isEmpty()) {
            List<NoticeAttachment> newAttachments = processAttachments(attachments, existingNotice);
            newAttachments.forEach(existingNotice::addAttachment);
        }

        Notice updatedNotice = noticeRepository.save(existingNotice);

        return NoticeDTO.fromEntity(updatedNotice);
    }

    @Override
    @Transactional
    public void deleteNotice(Long id) {
        log.debug("공지사항 삭제 - ID: {}", id);

        Notice notice = findNoticeById(id);

        // 첨부파일 실제 파일 삭제
        if (notice.getAttachments() != null) {
            notice.getAttachments().forEach(attachment -> {
                try {
                    deleteFile(attachment.getFileUrl());
                } catch (Exception e) {
                    log.warn("첨부파일 삭제 실패: {}", attachment.getFileName(), e);
                }
            });
        }

        noticeRepository.delete(notice);
    }

    @Override
    @Transactional
    public NoticeDTO incrementViews(Long id) {
        log.debug("공지사항 조회수 증가 - ID: {}", id);

        Notice notice = findNoticeById(id);
        notice.incrementViews();

        Notice updatedNotice = noticeRepository.save(notice);

        return NoticeDTO.fromEntity(updatedNotice);
    }

    // ===== Private Helper Methods =====

    /**
     * 공지사항 조회 (존재하지 않으면 예외 발생)
     */
    private Notice findNoticeById(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다. ID: " + id));
    }

    /**
     * 키워드로 검색 (searchType에 따라)
     */
    private Page<Notice> getNoticePageByKeyword(String keyword, String searchType, Pageable pageable) {
        if ("title".equalsIgnoreCase(searchType)) {
            return noticeRepository.findByTitleContainingOrderByPinnedAndCreatedAt(keyword, pageable);
        } else if ("content".equalsIgnoreCase(searchType)) {
            return noticeRepository.findByContentContainingOrderByPinnedAndCreatedAt(keyword, pageable);
        } else {
            // 기본값: titleOrContent
            return noticeRepository.findByTitleOrContentContainingOrderByPinnedAndCreatedAt(keyword, pageable);
        }
    }

    /**
     * 카테고리 + 키워드로 검색
     */
    private Page<Notice> getNoticePageByCategoryAndKeyword(String category, String keyword, String searchType, Pageable pageable) {
        if ("title".equalsIgnoreCase(searchType)) {
            return noticeRepository.findByCategoryAndTitleContainingOrderByPinnedAndCreatedAt(category, keyword, pageable);
        } else if ("content".equalsIgnoreCase(searchType)) {
            return noticeRepository.findByCategoryAndContentContainingOrderByPinnedAndCreatedAt(category, keyword, pageable);
        } else {
            // 기본값: titleOrContent
            return noticeRepository.findByCategoryAndTitleOrContentContainingOrderByPinnedAndCreatedAt(category, keyword, pageable);
        }
    }

    /**
     * 첨부파일 처리
     */
    private List<NoticeAttachment> processAttachments(List<MultipartFile> files, Notice notice) {
        List<NoticeAttachment> attachments = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            try {
                String fileUrl = saveFile(file);

                NoticeAttachment attachment = NoticeAttachment.builder()
                        .notice(notice)
                        .fileName(file.getOriginalFilename())
                        .fileUrl(fileUrl)
                        .fileSize(file.getSize())
                        .build();

                attachments.add(attachment);

                log.debug("첨부파일 처리 완료 - 파일명: {}, 크기: {}", file.getOriginalFilename(), file.getSize());
            } catch (Exception e) {
                log.error("첨부파일 처리 실패 - 파일명: {}", file.getOriginalFilename(), e);
                throw new RuntimeException("첨부파일 처리 중 오류가 발생했습니다: " + file.getOriginalFilename(), e);
            }
        }

        return attachments;
    }

    /**
     * 파일 저장
     */
    private String saveFile(MultipartFile file) throws IOException {
        // 업로드 디렉토리 생성
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // 고유 파일명 생성 (UUID + 원본 파일명)
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // 파일 저장
        Path filePath = uploadDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // URL 반환
        return baseUrl + "/" + uniqueFilename;
    }

    /**
     * 파일 삭제
     */
    private void deleteFile(String fileUrl) throws IOException {
        if (fileUrl == null || !fileUrl.startsWith(baseUrl)) {
            return;
        }

        // URL에서 파일명 추출
        String filename = fileUrl.substring(baseUrl.length() + 1);
        Path filePath = Paths.get(uploadPath).resolve(filename);

        // 파일 삭제
        if (Files.exists(filePath)) {
            Files.delete(filePath);
            log.debug("파일 삭제 완료: {}", filename);
        }
    }
}
