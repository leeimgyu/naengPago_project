package com.backend.dto;

import com.backend.entity.Notice;
import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeListResponse {

    private List<NoticeDTO> notices;
    private Integer totalCount;
    private Integer currentPage;
    private Integer totalPages;

    /**
     * Page → NoticeListResponse 변환
     */
    public static NoticeListResponse fromPage(Page<Notice> noticePage) {
        List<NoticeDTO> noticeDTOs = noticePage.getContent().stream()
                .map(NoticeDTO::fromEntity)
                .toList();

        return NoticeListResponse.builder()
                .notices(noticeDTOs)
                .totalCount((int) noticePage.getTotalElements())
                .currentPage(noticePage.getNumber() + 1) // 0-based → 1-based
                .totalPages(noticePage.getTotalPages())
                .build();
    }
}
