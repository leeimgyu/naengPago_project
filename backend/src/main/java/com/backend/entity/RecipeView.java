package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// 레시피 조회 이력 엔티티
@Entity
@Table(name = "recipe_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeView extends BasicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "view_id")
    private Long viewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rcp_seq", nullable = false)
    private Recipes recipeId;

    @Column(name = "viewed_at", nullable = false)
    @Builder.Default
    private LocalDateTime viewedAt = LocalDateTime.now();
}