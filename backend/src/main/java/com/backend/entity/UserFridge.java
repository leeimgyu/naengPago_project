package com.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

/**
 * 사용자 냉장고 재료 엔티티
 */
@Entity
@Table(name = "user_fridge")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFridge extends BasicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fridge_id")
    private Integer fridgeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "재료명은 필수입니다")
    @Size(max = 100, message = "재료명은 100자 이하여야 합니다")
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Size(max = 50, message = "수량은 50자 이하여야 합니다")
    @Column(name = "quantity", length = 50)
    private String quantity;

    @NotBlank(message = "카테고리는 필수입니다")
    @Size(max = 50, message = "카테고리는 50자 이하여야 합니다")
    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;
}
