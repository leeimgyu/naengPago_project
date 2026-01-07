package com.backend.repository;

import com.backend.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    /**
     * 전체 공지사항 조회 (정렬: 고정 우선, 최신순)
     */
    @Query("SELECT n FROM Notice n ORDER BY n.isPinned DESC, n.createdAt DESC")
    Page<Notice> findAllOrderByPinnedAndCreatedAt(Pageable pageable);

    /**
     * 제목으로 검색 (부분 일치, 정렬: 고정 우선, 최신순)
     */
    @Query("SELECT n FROM Notice n WHERE n.title LIKE %:keyword% ORDER BY n.isPinned DESC, n.createdAt DESC")
    Page<Notice> findByTitleContainingOrderByPinnedAndCreatedAt(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 내용으로 검색 (부분 일치, 정렬: 고정 우선, 최신순)
     */
    @Query("SELECT n FROM Notice n WHERE n.content LIKE %:keyword% ORDER BY n.isPinned DESC, n.createdAt DESC")
    Page<Notice> findByContentContainingOrderByPinnedAndCreatedAt(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 제목 또는 내용으로 검색 (부분 일치, 정렬: 고정 우선, 최신순)
     */
    @Query("SELECT n FROM Notice n WHERE n.title LIKE %:keyword% OR n.content LIKE %:keyword% ORDER BY n.isPinned DESC, n.createdAt DESC")
    Page<Notice> findByTitleOrContentContainingOrderByPinnedAndCreatedAt(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 카테고리로 필터링 (정렬: 고정 우선, 최신순)
     */
    @Query("SELECT n FROM Notice n WHERE n.category = :category ORDER BY n.isPinned DESC, n.createdAt DESC")
    Page<Notice> findByCategoryOrderByPinnedAndCreatedAt(@Param("category") String category, Pageable pageable);

    /**
     * 카테고리 + 제목 검색 (정렬: 고정 우선, 최신순)
     */
    @Query("SELECT n FROM Notice n WHERE n.category = :category AND n.title LIKE %:keyword% ORDER BY n.isPinned DESC, n.createdAt DESC")
    Page<Notice> findByCategoryAndTitleContainingOrderByPinnedAndCreatedAt(@Param("category") String category, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 카테고리 + 내용 검색 (정렬: 고정 우선, 최신순)
     */
    @Query("SELECT n FROM Notice n WHERE n.category = :category AND n.content LIKE %:keyword% ORDER BY n.isPinned DESC, n.createdAt DESC")
    Page<Notice> findByCategoryAndContentContainingOrderByPinnedAndCreatedAt(@Param("category") String category, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 카테고리 + 제목 또는 내용 검색 (정렬: 고정 우선, 최신순)
     */
    @Query("SELECT n FROM Notice n WHERE n.category = :category AND (n.title LIKE %:keyword% OR n.content LIKE %:keyword%) ORDER BY n.isPinned DESC, n.createdAt DESC")
    Page<Notice> findByCategoryAndTitleOrContentContainingOrderByPinnedAndCreatedAt(@Param("category") String category, @Param("keyword") String keyword, Pageable pageable);

    /**
     * 고정된 공지사항만 조회
     */
    @Query("SELECT n FROM Notice n WHERE n.isPinned = true ORDER BY n.createdAt DESC")
    Page<Notice> findPinnedNotices(Pageable pageable);
}
