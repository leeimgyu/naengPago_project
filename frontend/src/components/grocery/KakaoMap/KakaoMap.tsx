/**
 * Kakao Map Component
 * @description 카카오맵 API를 사용한 주변 식료품점 지도 컴포넌트
 *
 * 주요 기능:
 * 1. 카카오맵 API 동적 로드 및 지도 초기화
 * 2. 식료품점 마커 표시 및 인포윈도우 제공
 * 3. 마커 클릭 시 상세 정보 표시 및 StoreCards와 상호작용
 * 4. 외부에서 특정 매장으로 포커스 가능 (forwardRef 패턴)
 *
 * @example
 * // 부모 컴포넌트에서 사용
 * const mapRef = useRef<KakaoMapRef>(null);
 * <KakaoMap ref={mapRef} stores={storeList} onStoreClick={handleStoreClick} />
 * mapRef.current?.focusStore('store-123'); // 프로그래밍 방식으로 매장 포커스
 */

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import styles from "./KakaoMap.module.css";
import { getUserAddressCoordinates, searchNearbyStores } from "@/services/apiService";
import type { Coordinates, StoreData as ApiStoreData } from "@/types/api";



// 카카오맵 전역 객체 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

/**
 * 매장 카테고리 타입 (실제 API에서 반환하는 카테고리)
 */
export type StoreCategory = '대형마트' | '편의점';

/**
 * 카테고리별 색상 정보 인터페이스
 */
export interface CategoryColor {
  primary: string;      // 메인 색상
  background: string;   // 배경 색상
  border: string;       // 테두리 색상
  text: string;         // 텍스트 색상 (접근성)
}

/**
 * 카테고리별 색상 맵핑 (실제 사용하는 카테고리)
 * - 대형마트: 파랑 (신뢰감, 대형)
 * - 편의점: 빨강 (즉시성, 편리함)
 */
export const CATEGORY_COLORS: Record<StoreCategory, CategoryColor> = {
  '대형마트': {
    primary: '#2196F3',
    background: '#E3F2FD',
    border: '#2196F3',
    text: '#1976D2',
  },
  '편의점': {
    primary: '#F44336',
    background: '#FFEBEE',
    border: '#F44336',
    text: '#D32F2F',
  },
};

/**
 * 매장 데이터 인터페이스 (API와 호환)
 * @property {string} id - 매장 고유 식별자
 * @property {string} name - 매장명
 * @property {string} address - 주소
 * @property {string} phone - 전화번호 (선택)
 * @property {StoreCategory} category - 매장 카테고리 (대형마트, 편의점)
 * @property {number} distance - 사용자 위치로부터의 거리 (미터)
 * @property {Object} position - 위도/경도 좌표
 */
export interface StoreData {
  id: string;
  name: string;
  address: string;
  phone?: string;
  hours?: string;
  category: StoreCategory;
  distance: number;
  position: {
    lat: number;
    lng: number;
  };
}

/**
 * KakaoMap 컴포넌트 Props
 * @property {Function} onStoreClick - 매장 마커 클릭 시 콜백 함수
 * @property {StoreData[]} stores - 표시할 매장 데이터 배열
 * @property {Function} onStoresLoad - 매장 데이터 로드 완료 시 콜백 함수
 */
interface KakaoMapProps {
  onStoreClick?: (store: StoreData) => void;
  stores: StoreData[];
  onStoresLoad?: (stores: StoreData[]) => void;
}

/**
 * 외부에서 접근 가능한 KakaoMap 메서드 인터페이스
 * @property {Function} focusStore - 특정 매장 ID로 지도 포커스 이동
 */
export interface KakaoMapRef {
  focusStore: (storeId: string) => void;
}

const KakaoMap = forwardRef<KakaoMapRef, KakaoMapProps>(({ onStoreClick, stores, onStoresLoad }, ref) => {
  // DOM 요소 참조 및 상태 관리
  const mapRef = useRef<HTMLDivElement>(null); // 지도가 렌더링될 DOM 요소
  const [map, setMap] = useState<any>(null); // 카카오맵 인스턴스
  const [markers, setMarkers] = useState<any[]>([]); // 마커 배열
  const [infoWindows, setInfoWindows] = useState<any[]>([]); // 인포윈도우 배열
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null); // 사용자 위치 좌표
  const userMarkerRef = useRef<any>(null); // 사용자 위치 마커 참조
  const userInfoWindowRef = useRef<any>(null); // 사용자 위치 인포윈도우 참조
  const [nearbyStores, setNearbyStores] = useState<StoreData[]>([]); // 주변 매장 목록
  const [isLoadingStores, setIsLoadingStores] = useState(false); // 매장 검색 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [isRefreshing, setIsRefreshing] = useState(false); // 새로고침 로딩 상태

  /**
   * 매장 ID별 마커/인포윈도우 데이터 매핑
   * 외부(StoreCards)에서 특정 매장 포커스 시 빠른 조회를 위해 Map 사용
   */
  const markersDataRef = useRef<Map<string, { marker: any; infoWindow: any; store: StoreData }>>(new Map());

  /**
   * 부모 컴포넌트에 노출되는 메서드 정의 (forwardRef 패턴)
   *
   * @method focusStore - 특정 매장으로 지도 포커스 및 인포윈도우 표시
   * @param {string} storeId - 포커스할 매장 ID
   *
   * 동작:
   * 1. 모든 인포윈도우 닫기
   * 2. 선택된 매장의 인포윈도우 열기
   * 3. 해당 위치로 지도 중심 이동 및 줌 레벨 조정
   */
  useImperativeHandle(ref, () => ({
    focusStore: (storeId: string) => {
      const markerData = markersDataRef.current.get(storeId);
      if (markerData && map) {
        // 모든 인포윈도우 닫기
        markersDataRef.current.forEach(({ infoWindow }) => {
          infoWindow.close();
        });

        // 선택된 마커의 인포윈도우 열기
        markerData.infoWindow.open(map, markerData.marker);

        // 해당 마커 위치로 지도 중심 이동
        const position = markerData.marker.getPosition();
        map.setCenter(position);
        map.setLevel(4); // 줌 레벨 4 (더 가까이 확대)
      }
    },
  }));

  /**
   * 카카오맵 초기화 Effect
   *
   * 동작:
   * 1. .env 파일에서 VITE_KAKAO_MAP_APP_KEY 환경 변수 로드
   * 2. 카카오맵 JavaScript SDK 스크립트 동적 추가
   * 3. 스크립트 로드 완료 후 지도 인스턴스 생성
   * 4. 줌 컨트롤(확대/축소 버튼) 추가
   * 5. 컴포넌트 언마운트 시 스크립트 제거 (메모리 누수 방지)
   *
   * @dependency [] - 컴포넌트 마운트 시 한 번만 실행
   */
  useEffect(() => {
    // 환경 변수에서 API 키 가져오기 (.env 파일에서 VITE_KAKAO_MAP_APP_KEY)
    const apiKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

    if (!apiKey) {
      console.error(
        "카카오맵 API 키가 설정되지 않았습니다. .env 파일을 확인해주세요."
      );
      return;
    }

    // 카카오맵 JavaScript SDK 스크립트 동적 생성 및 로드
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    // 스크립트 로드 완료 시 지도 초기화
    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          // 지도 초기 옵션 설정
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
            level: 5, // 줌 레벨 (1~14, 낮을수록 확대)
          };

          // 카카오맵 인스턴스 생성
          const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);

          // 확대/축소 컨트롤 버튼 추가 (우측 배치)
          const zoomControl = new window.kakao.maps.ZoomControl();
          kakaoMap.addControl(
            zoomControl,
            window.kakao.maps.ControlPosition.RIGHT
          );

          setMap(kakaoMap);
        }
      });
    };

    // 클린업: 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  /**
   * 사용자 위치 로드 및 주변 매장 검색 Effect
   *
   * 동작:
   * 1. getUserAddressCoordinates() 호출하여 사용자 주소의 좌표 가져오기
   * 2. 성공 시 userLocation state에 저장
   * 3. 사용자 위치를 기준으로 주변 식료품점 검색
   * 4. 검색 결과를 nearbyStores state에 저장
   * 5. 에러 발생 시 에러 메시지 표시
   *
   * @dependency [] - 컴포넌트 마운트 시 한 번만 실행
   */
  useEffect(() => {
    const loadUserLocationAndStores = async () => {
      try {
        setError(null); // 에러 초기화
        const coords = await getUserAddressCoordinates();

        if (coords) {
          setUserLocation(coords);

          // 주변 매장 검색
          setIsLoadingStores(true);

          const storesData = await searchNearbyStores(
            coords.latitude,
            coords.longitude,
            1000 // 1km 반경
          );

          if (storesData && storesData.stores) {
            setNearbyStores(storesData.stores);

            // 부모 컴포넌트로 매장 데이터 전달
            if (onStoresLoad) {
              onStoresLoad(storesData.stores);
            }
          } else {
            setNearbyStores([]);
            setError('주변 1km 이내에 식료품점이 없습니다. 반경을 늘려보세요.');
          }
          setIsLoadingStores(false);
        } else {
          console.warn('⚠️ 사용자 위치를 가져올 수 없습니다.');
          setError('사용자 주소를 찾을 수 없습니다. 회원정보에서 주소를 등록해주세요.');
          setIsLoadingStores(false);
        }
      } catch (error) {
        console.error('❌ 사용자 위치 조회 중 오류:', error);
        setError('정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setIsLoadingStores(false);
      }
    };

    loadUserLocationAndStores();
  }, []);

  /**
   * 매장 마커 및 인포윈도우 생성 Effect
   *
   * 동작:
   * 1. 기존 마커 및 인포윈도우 제거 (nearbyStores 변경 시)
   * 2. 각 매장별 마커 생성 및 지도에 표시
   * 3. 인포윈도우 콘텐츠 생성 (매장명, 주소, 거리, 전화번호, 카테고리)
   * 4. 마커 클릭 이벤트 리스너 등록 (인포윈도우 표시 + StoreCards 스크롤)
   * 5. 지도 빈 공간 클릭 시 모든 인포윈도우 닫기
   * 6. 첫 번째 매장 위치로 지도 중심 이동
   *
   * @dependency [map, nearbyStores] - 지도 인스턴스 또는 매장 목록 변경 시 재실행
   */
  useEffect(() => {
    if (map && nearbyStores.length > 0) {
      // 기존 마커 제거 (지도에서 숨김)
      markers.forEach((marker) => marker.setMap(null));
      // 기존 인포윈도우 닫기
      infoWindows.forEach((infoWindow) => infoWindow.close());

      // 새로운 마커/인포윈도우 배열 초기화
      const newMarkers: any[] = [];
      const newInfoWindows: any[] = [];
      markersDataRef.current.clear(); // 기존 매핑 데이터 초기화

      // 각 매장별 마커 및 인포윈도우 생성
      nearbyStores.forEach((store) => {
        const markerPosition = new window.kakao.maps.LatLng(
          store.position.lat,
          store.position.lng
        );

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          title: store.name,
        });

        marker.setMap(map);

        // 카테고리별 색상 가져오기
        const categoryColor = CATEGORY_COLORS[store.category];

        // 인포윈도우 콘텐츠 생성 (카테고리별 색상 적용, 거리 정보 포함)
        const infoWindowContent = `
          <div style="padding: 20px; min-width: 280px; max-width: 380px; line-height: 1.5;">
            <div style="font-size: 17px; font-weight: 700; color: #333; margin-bottom: 12px; word-break: keep-all;">
              ${store.name}
            </div>
            <div style="font-size: 14px; color: #666; margin-bottom: 8px; line-height: 1.6; word-break: keep-all;">
              📍 ${store.address}
            </div>
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
              📏 ${store.distance}m
            </div>
            ${
              store.phone && store.phone.trim() !== ""
                ? `
              <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
                📞 ${store.phone}
              </div>
            `
                : ""
            }
            <div style="
              display: inline-block;
              font-size: 13px;
              font-weight: 600;
              margin-top: 12px;
              padding: 6px 12px;
              background: ${categoryColor.background};
              color: ${categoryColor.text};
              border: 1px solid ${categoryColor.border};
              border-radius: 6px;
            ">
              ${store.category}
            </div>
          </div>
        `;

        // 인포윈도우 생성
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoWindowContent,
          removable: false,
        });

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, "click", () => {
          // 다른 인포윈도우 모두 닫기
          newInfoWindows.forEach((iw) => iw.close());

          // 사용자 위치 인포윈도우도 닫기
          if (userInfoWindowRef.current) {
            userInfoWindowRef.current.close();
          }

          // 현재 인포윈도우 열기
          infoWindow.open(map, marker);

          // 기존 콜백 호출 (StoreCards로 스크롤)
          if (onStoreClick) {
            onStoreClick(store);
          }

          // StoreCards 섹션으로 스크롤
          setTimeout(() => {
            const cardsSection = document.querySelector(
              '[class*="storeCardsSection"]'
            );
            if (cardsSection) {
              cardsSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        });

        newMarkers.push(marker);
        newInfoWindows.push(infoWindow);

        // 마커 데이터 저장 (storeId를 키로 사용)
        markersDataRef.current.set(store.id, { marker, infoWindow, store });
      });

      setMarkers(newMarkers);
      setInfoWindows(newInfoWindows);

      // 지도 클릭 시 모든 인포윈도우 닫기
      window.kakao.maps.event.addListener(map, "click", () => {
        newInfoWindows.forEach((iw) => iw.close());
        // 사용자 위치 인포윈도우도 닫기
        if (userInfoWindowRef.current) {
          userInfoWindowRef.current.close();
        }
      });

      // 첫 번째 매장 위치로 지도 중심 이동
      if (nearbyStores[0]) {
        const firstPosition = new window.kakao.maps.LatLng(
          nearbyStores[0].position.lat,
          nearbyStores[0].position.lng
        );
        map.setCenter(firstPosition);
      }
    }
  }, [map, nearbyStores]);

  /**
   * 사용자 위치 마커 표시 Effect
   *
   * 동작:
   * 1. 지도 인스턴스와 사용자 위치가 모두 있을 때 실행
   * 2. 기존 사용자 마커가 있으면 제거
   * 3. 파란색 집 모양 커스텀 마커 생성 (SVG 아이콘)
   * 4. 마커를 지도에 표시
   * 5. 사용자 위치로 지도 중심 이동 (매장이 없을 경우에만)
   *
   * @dependency [map, userLocation] - 지도 인스턴스 또는 사용자 위치 변경 시 재실행
   */
  useEffect(() => {
    if (map && userLocation) {
      // 기존 사용자 마커 제거
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }

      // 사용자 위치 좌표 생성
      const userPosition = new window.kakao.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      );

      // 집 모양 SVG 아이콘 생성 (빨간색)
      const homeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><ellipse cx="24" cy="44" rx="12" ry="3" fill="rgba(0,0,0,0.2)"/><path d="M 24 8 L 8 22 L 12 22 L 12 38 L 36 38 L 36 22 L 40 22 Z" fill="#F44336" stroke="#D32F2F" stroke-width="2"/><rect x="14" y="24" width="20" height="14" fill="#EF5350" stroke="#D32F2F" stroke-width="1.5"/><rect x="20" y="28" width="8" height="10" fill="#D32F2F" stroke="#C62828" stroke-width="1"/><circle cx="25" cy="33" r="1" fill="#FFEB3B"/><rect x="16" y="26" width="3" height="3" fill="#FFCDD2" stroke="#D32F2F" stroke-width="0.5"/><rect x="29" y="26" width="3" height="3" fill="#FFCDD2" stroke="#D32F2F" stroke-width="0.5"/></svg>`;

      // SVG를 URL 인코딩으로 변환 (base64 대신 더 안전한 방법)
      const homeIconDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(homeIconSvg)}`;

      // 커스텀 마커 이미지 생성
      const imageSize = new window.kakao.maps.Size(48, 48); // 마커 이미지 크기
      const imageOption = { offset: new window.kakao.maps.Point(24, 44) }; // 마커 이미지의 기준점 (하단 중앙)

      const markerImage = new window.kakao.maps.MarkerImage(
        homeIconDataUri,
        imageSize,
        imageOption
      );

      // 사용자 위치 마커 생성 (집 모양 커스텀 마커)
      const userMarker = new window.kakao.maps.Marker({
        position: userPosition,
        image: markerImage,
        title: '내 위치',
        zIndex: 9999, // 인포윈도우보다 위에 표시 (최상위)
      });

      // 마커를 지도에 표시
      userMarker.setMap(map);
      userMarkerRef.current = userMarker;

      // 인포윈도우 생성 (내 위치 표시)
      const infoWindowContent = `
        <div style="padding: 15px; min-width: 200px; text-align: center;">
          <div style="font-size: 16px; font-weight: 700; color: #F44336; margin-bottom: 8px;">
            🏠 내 위치
          </div>
          <div style="font-size: 12px; color: #666;">
            이 주변의 식료품점을 확인하세요
          </div>
        </div>
      `;

      const userInfoWindow = new window.kakao.maps.InfoWindow({
        content: infoWindowContent,
        removable: false,
      });

      // 인포윈도우 ref에 저장
      userInfoWindowRef.current = userInfoWindow;

      // 사용자 마커 클릭 이벤트 - 인포윈도우 표시
      window.kakao.maps.event.addListener(userMarker, 'click', () => {
        userInfoWindow.open(map, userMarker);
      });

      // 매장이 없을 경우에만 사용자 위치로 지도 중심 이동
      if (nearbyStores.length === 0) {
        map.setCenter(userPosition);
        map.setLevel(4); // 줌 레벨 4 (적당한 확대)
      }

    }
  }, [map, userLocation, nearbyStores.length]);

  /**
   * 주변 매장 정보 새로고침 함수
   *
   * 동작:
   * 1. 사용자 위치가 있는지 확인
   * 2. 새로고침 중이 아닌지 확인
   * 3. 주변 매장 재검색
   * 4. 성공 시 매장 목록 업데이트
   */
  const handleRefresh = async () => {
    if (!userLocation || isRefreshing) return;

    setIsRefreshing(true);
    setIsLoadingStores(true);
    setError(null);

    try {
      const storesData = await searchNearbyStores(
        userLocation.latitude,
        userLocation.longitude,
        1000 // 1km 반경
      );

      if (storesData && storesData.stores) {
        setNearbyStores(storesData.stores);

        // 부모 컴포넌트로 매장 데이터 전달
        if (onStoresLoad) {
          onStoresLoad(storesData.stores);
        }
      } else {
        setNearbyStores([]);
        setError('주변 1km 이내에 식료품점이 없습니다.');
      }
    } catch (error) {
      console.error('❌ 새로고침 실패:', error);
      setError('새로고침 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsRefreshing(false);
      setIsLoadingStores(false);
    }
  };

  return (
    <section className={styles.mapSection}>
      <div className={styles.mapContainer}>
        <div className={styles.mapHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h2 className={styles.mapTitle}>주변 식료품점 지도</h2>

            {/* 새로고침 버튼 */}
            {userLocation && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoadingStores}
                style={{
                  padding: '10px 20px',
                  background: isRefreshing ? '#ccc' : 'var(--brand-color)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isRefreshing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  if (!isRefreshing && !isLoadingStores) {
                    e.currentTarget.style.background = '#2a5240';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isRefreshing && !isLoadingStores) {
                    e.currentTarget.style.background = 'var(--brand-color)';
                  }
                }}
              >
                {isRefreshing ? '새로고침 중...' : '🔄 새로고침'}
              </button>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{
              padding: '1rem',
              marginTop: '1rem',
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              ⚠️ {error}
            </div>
          )}

          <p className={styles.mapSubtitle}>
            {isLoadingStores
              ? '주변 매장을 검색하는 중...'
              : nearbyStores.length > 0
              ? `주변 ${nearbyStores.length}개 매장 (1km 반경)`
              : '마커를 클릭하면 매장 상세 정보를 확인할 수 있습니다'}
          </p>
        </div>
        <div ref={mapRef} className={styles.map} />
      </div>
    </section>
  );
});

KakaoMap.displayName = 'KakaoMap';

export default KakaoMap;
