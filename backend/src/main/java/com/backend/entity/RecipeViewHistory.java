package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "recipe_view_history",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "recipe_id"})
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeViewHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "view_history_id")
    private Long viewHistoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rcp_seq", nullable = false)
    private Recipes recipe;

    @CreatedDate
    @Column(name = "first_viewed_at", nullable = false, updatable = false)
    private LocalDateTime firstViewedAt;

    @LastModifiedDate
    @Column(name = "last_viewed_at", nullable = false)
    private LocalDateTime lastViewedAt;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 1;

    /**
     * 조회수 증가
     */
    public void incrementViewCount() {
        this.viewCount++;
    }
}
