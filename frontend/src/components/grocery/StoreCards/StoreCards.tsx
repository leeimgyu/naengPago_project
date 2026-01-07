/**
 * Store Cards Component
 * @description 주변 식료품점 정보 카드 리스트 (카테고리별 색상 적용)
 */

import React, { useMemo, useState } from 'react';
import type { StoreData } from '../KakaoMap/KakaoMap';
import { CATEGORY_COLORS } from '../KakaoMap/KakaoMap';
import StoreDetailModal from '../StoreDetailModal/StoreDetailModal';
import styles from './StoreCards.module.css';

interface StoreCardsProps {
  stores: StoreData[];
  selectedStore?: StoreData | null;
  onCardClick?: (store: StoreData) => void;
}

type SortBy = 'distance' | 'name';
type FilterCategory = 'all' | '대형마트' | '편의점';

const ITEMS_PER_PAGE = 6;
const PAGE_GROUP_SIZE = 5;

const StoreCards: React.FC<StoreCardsProps> = ({ stores, selectedStore, onCardClick }) => {
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [modalStore, setModalStore] = useState<StoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 상세보기 버튼 클릭 핸들러
  const handleDetailClick = (store: StoreData, e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    setModalStore(store);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalStore(null);
  };

  // 정렬 및 필터링 로직
  const filteredAndSortedStores = useMemo(() => {
    let filtered = stores;

    // 카테고리 필터링
    if (filterCategory !== 'all') {
      filtered = filtered.filter(store => store.category === filterCategory);
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      } else {
        return a.name.localeCompare(b.name, 'ko');
      }
    });

    return sorted;
  }, [stores, sortBy, filterCategory]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredAndSortedStores.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStores = filteredAndSortedStores.slice(startIndex, endIndex);

  // 필터/정렬 변경 시 페이지 초기화
  React.useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, filterCategory]);

  // 페이지 그룹 계산
  const startPage = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className={styles.storeCardsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>주변 식료품점 정보</h2>
            <p className={styles.sectionSubtitle}>
              신선한 식재료를 구매할 수 있는 가까운 매장을 확인해보세요
            </p>
          </div>

          {/* 정렬 및 필터 버튼 */}
          <div className={styles.controls}>
            {/* 정렬 버튼 */}
            <div className={styles.sortButtons}>
              <button
                className={`${styles.sortButton} ${sortBy === 'distance' ? styles.active : ''}`}
                onClick={() => setSortBy('distance')}
              >
                거리순
              </button>
              <button
                className={`${styles.sortButton} ${sortBy === 'name' ? styles.active : ''}`}
                onClick={() => setSortBy('name')}
              >
                이름순
              </button>
            </div>

            {/* 카테고리 필터 버튼 */}
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${filterCategory === 'all' ? styles.active : ''}`}
                onClick={() => setFilterCategory('all')}
              >
                전체
              </button>
              <button
                className={`${styles.filterButton} ${filterCategory === '대형마트' ? styles.active : ''}`}
                onClick={() => setFilterCategory('대형마트')}
              >
                대형마트
              </button>
              <button
                className={`${styles.filterButton} ${filterCategory === '편의점' ? styles.active : ''}`}
                onClick={() => setFilterCategory('편의점')}
              >
                편의점
              </button>
            </div>
          </div>
        </div>

        <div className={styles.cardsGrid}>
          {currentStores.map((store) => {
            // 카테고리별 색상 가져오기
            const categoryColor = CATEGORY_COLORS[store.category];

            return (
              <div
                key={store.id}
                className={`${styles.storeCard} ${
                  selectedStore?.id === store.id ? styles.selected : ''
                }`}
                onClick={() => {
                  if (onCardClick) {
                    onCardClick(store);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.storeName}>{store.name}</h3>
                  <span
                    className={styles.category}
                    style={{
                      backgroundColor: categoryColor.background,
                      color: categoryColor.text,
                      border: `1px solid ${categoryColor.border}`,
                    }}
                  >
                    {store.category}
                  </span>
                </div>

              <div className={styles.cardBody}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📍</span>
                  <span className={styles.infoText}>{store.address}</span>
                </div>

                {/* 거리 표시 */}
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>🏃‍♂️</span>
                  <span className={styles.infoText}>
                    {store.distance >= 1000
                      ? `${(store.distance / 1000).toFixed(1)}km`
                      : `${store.distance}m`}
                  </span>
                </div>

                {/* 영업시간 표시 */}
                {store.hours && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🕒</span>
                    <span className={styles.infoText}>{store.hours}</span>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.detailBtn}
                  onClick={(e) => handleDetailClick(store, e)}
                >
                  상세보기
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {filteredAndSortedStores.length === 0 && stores.length > 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>🔍</p>
            <p className={styles.emptyText}>선택한 조건에 맞는 매장이 없습니다</p>
          </div>
        )}

        {stores.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}></p>
            <p className={styles.emptyText}>주변 식료품점 정보를 불러오는 중입니다...</p>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={`${styles['page-btn']} ${styles.arrow}`}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              ‹
            </button>

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <button
                type="button"
                key={page}
                className={`${styles['page-btn']} ${currentPage === page ? styles.active : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className={`${styles['page-btn']} ${styles.arrow}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      <StoreDetailModal
        store={modalStore}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </section>
  );
};

export default StoreCards;
