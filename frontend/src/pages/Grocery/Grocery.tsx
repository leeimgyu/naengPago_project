/**
 * Grocery Page Component
 * @description 주변 식료품점 찾기 페이지
 */

import React, { useState, useRef } from 'react';
import GroceryHero from '../../components/grocery/GroceryHero/GroceryHero';
import KakaoMap, { type StoreData, type KakaoMapRef } from '../../components/grocery/KakaoMap/KakaoMap';
import StoreCards from '../../components/grocery/StoreCards/StoreCards';
import styles from './Grocery.module.css';

const Grocery: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [stores, setStores] = useState<StoreData[]>([]);
  const kakaoMapRef = useRef<KakaoMapRef>(null);

  // 마커 클릭 시: StoreCards로 스크롤
  const handleMarkerClick = (store: StoreData) => {
    setSelectedStore(store);
    // 마커 클릭 시 스크롤은 KakaoMap 컴포넌트에서 처리됨
  };

  // 카드 클릭 시: 지도로 스크롤 + 해당 마커로 포커스
  const handleCardClick = (store: StoreData) => {
    setSelectedStore(store);

    // 지도의 해당 마커로 포커스 (인포윈도우 열기 + 중심 이동)
    if (kakaoMapRef.current) {
      kakaoMapRef.current.focusStore(store.id);
    }

    // 지도 섹션으로 스크롤
    setTimeout(() => {
      const mapSection = document.querySelector('[class*="mapSection"]');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <main className={styles.groceryPage}>
      {/* Hero Section */}
      <GroceryHero />

      {/* Kakao Map Section */}
      <KakaoMap
        ref={kakaoMapRef}
        stores={stores}
        onStoreClick={handleMarkerClick}
        onStoresLoad={(loadedStores) => setStores(loadedStores)}
      />

      {/* Store Cards Section */}
      <StoreCards
        stores={stores}
        selectedStore={selectedStore}
        onCardClick={handleCardClick}
      />
    </main>
  );
};

export default Grocery;
