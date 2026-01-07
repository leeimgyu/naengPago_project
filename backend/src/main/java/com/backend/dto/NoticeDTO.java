package com.backend.dto;

import com.backend.entity.Notice;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeDTO {

    private Long id;
    private String category;
    private String title;
    private String author;
    private String date;  // 프론트엔드 형식: ISO 8601
    private Integer views;
    private String content;
    private Boolean isPinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<NoticeAttachmentDTO> attachments = new ArrayList<>();

    /**
     * Entity → DTO 변환
     */
    public static NoticeDTO fromEntity(Notice notice) {
        return NoticeDTO.builder()
                .id(notice.getId())
                .category(notice.getCategory())
                .title(notice.getTitle())
                .author(notice.getAuthor())
                .date(notice.getCreatedAt() != null ? notice.getCreatedAt().toString() : null)
                .views(notice.getViews())
                .content(notice.getContent())
                .isPinned(notice.getIsPinned()) // 상단 고정 o, x
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
                .attachments(notice.getAttachments() != null
                        ? notice.getAttachments().stream()
                        .map(NoticeAttachmentDTO::fromEntity)
                        .collect(Collectors.toList())
                        : new ArrayList<>())
                .build();
    }

    /**
     * DTO → Entity 변환 (생성/수정 시 사용)
     */
    public Notice toEntity() {
        return Notice.builder()
                .id(this.id)
                .category(this.category)
                .title(this.title)
                .author(this.author != null ? this.author : "관리자")
                .content(this.content)
                .views(this.views != null ? this.views : 0)
                .isPinned(this.isPinned != null ? this.isPinned : false)
                .build();
    }
}
