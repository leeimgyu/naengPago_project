package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BasicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @Column(name = "user_id", nullable = false)
    private Integer userId; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rcp_seq", nullable = false) // rcp_seq 컬럼으로 Recipes 테이블과 조인
    private Recipes recipe;

    @Column(nullable = false, length = 1000)
    private String content;
}
