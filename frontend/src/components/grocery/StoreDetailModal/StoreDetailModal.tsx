/**
 * Store Detail Modal Component
 * @description 매장 상세 정보를 표시하는 모달 컴포넌트
 */

import React from 'react';
import type { StoreData } from '../KakaoMap/KakaoMap';
import { CATEGORY_COLORS } from '../KakaoMap/KakaoMap';
import styles from './StoreDetailModal.module.css';

interface StoreDetailModalProps {
  store: StoreData | null;
  isOpen: boolean;
  onClose: () => void;
}

const StoreDetailModal: React.FC<StoreDetailModalProps> = ({ store, isOpen, onClose }) => {
  // ESC 키로 모달 닫기 및 스크롤 관리 (early return 전에 실행)
  React.useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = '';
      return;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // 모달 열릴 때 body 스크롤 방지
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEsc);

    return () => {
      // cleanup: 스크롤 복원 및 이벤트 제거
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !store) return null;

  const categoryColor = CATEGORY_COLORS[store.category];

  // 전화번호 포맷팅 (하이픈 제거)
  const getPhoneHref = (phone?: string) => {
    if (!phone) return '';
    return `tel:${phone.replace(/-/g, '')}`;
  };

  // 카카오맵 길찾기 URL
  const getDirectionsUrl = () => {
    return `https://map.kakao.com/link/to/${encodeURIComponent(store.name)},${store.position.lat},${store.position.lng}`;
  };

  // 카카오맵에서 보기 URL
  const getKakaoMapUrl = () => {
    return `https://map.kakao.com/link/map/${encodeURIComponent(store.name)},${store.position.lat},${store.position.lng}`;
  };

  // 배경 클릭 시 모달 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        {/* 모달 헤더 */}
        <div className={styles.modalHeader}>
          <h2 className={styles.storeName}>{store.name}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        {/* 카테고리 배지 */}
        <div className={styles.categoryBadge}>
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

        {/* 모달 바디 */}
        <div className={styles.modalBody}>
          {/* 기본 정보 */}
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>기본 정보</h3>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}></span>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>주소</span>
                <span className={styles.infoValue}>{store.address}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}></span>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>거리</span>
                <span className={styles.infoValue}>
                  {store.distance >= 1000
                    ? `${(store.distance / 1000).toFixed(1)}km`
                    : `${store.distance}m`}
                </span>
              </div>
            </div>

            {store.phone && (
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}></span>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>전화번호</span>
                  <a href={getPhoneHref(store.phone)} className={styles.phoneLink}>
                    {store.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className={styles.actionSection}>
            <h3 className={styles.sectionTitle}>빠른 이동</h3>

            <div className={styles.buttonGroup}>
              {/* 길찾기 */}
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                <span className={styles.actionIcon}>🚗</span>
                <span className={styles.actionText}>길찾기</span>
              </a>

              {/* 카카오맵에서 보기 */}
              <a
                href={getKakaoMapUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                <span className={styles.actionIcon}>🗺️</span>
                <span className={styles.actionText}>카카오맵</span>
              </a>

              {/* 전화 걸기 */}
              {store.phone && (
                <a
                  href={getPhoneHref(store.phone)}
                  className={styles.actionButton}
                >
                  <span className={styles.actionIcon}>📞</span>
                  <span className={styles.actionText}>전화하기</span>
                </a>
              )}
            </div>
          </div>

          {/* 안내 문구 */}
          <div className={styles.noteSection}>
            <p className={styles.noteText}>
              💡 자세한 정보는 카카오맵에서 확인하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailModal;
