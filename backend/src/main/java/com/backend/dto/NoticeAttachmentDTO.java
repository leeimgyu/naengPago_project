package com.backend.dto;

import com.backend.entity.NoticeAttachment;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeAttachmentDTO {

    private Long id;
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private LocalDateTime uploadedAt;

    /**
     * Entity → DTO 변환
     */
    public static NoticeAttachmentDTO fromEntity(NoticeAttachment attachment) {
        return NoticeAttachmentDTO.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileUrl(attachment.getFileUrl())
                .fileSize(attachment.getFileSize())
                .uploadedAt(attachment.getCreatedAt())
                .build();
    }
}
