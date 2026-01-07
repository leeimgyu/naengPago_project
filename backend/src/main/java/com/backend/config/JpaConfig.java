package com.backend.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA 설정
 *
 * - JPA Auditing 활성화 (BasicEntity의 createdAt, updatedAt 자동 관리)
 * - QueryDSL JPAQueryFactory 빈 등록
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * QueryDSL JPAQueryFactory 빈 등록
     *
     * @return JPAQueryFactory
     */
    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
