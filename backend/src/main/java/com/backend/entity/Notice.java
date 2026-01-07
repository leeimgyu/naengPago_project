package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice extends BasicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long id;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "author", nullable = false, length = 100)
    @Builder.Default
    private String author = "관리자";

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "views", nullable = false)
    @Builder.Default
    private Integer views = 0;

    @Column(name = "is_pinned", nullable = false)
    @Builder.Default
    private Boolean isPinned = false;

    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<NoticeAttachment> attachments = new ArrayList<>();

    /**
     * 조회수 증가
     */
    public void incrementViews() {
        this.views++;
    }

    /**
     * 첨부파일 추가
     */
    public void addAttachment(NoticeAttachment attachment) {
        attachments.add(attachment);
        attachment.setNotice(this);
    }

    /**
     * 첨부파일 제거
     */
    public void removeAttachment(NoticeAttachment attachment) {
        attachments.remove(attachment);
        attachment.setNotice(null);
    }
}
