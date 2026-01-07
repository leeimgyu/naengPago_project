/**
 * Location Map Component
 * @description 카카오맵을 이용한 회사 위치 약도
 */

import React, { useEffect, useRef } from "react";
import styles from "./LocationMap.module.css";

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

const LocationMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

    if (!apiKey) {
      console.error("카카오맵 API 키가 설정되지 않았습니다.");
      return;
    }

    // 카카오맵 스크립트 로드
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          // 부산파이낸스센터 좌표
          const position = new window.kakao.maps.LatLng(35.1549, 129.0607);

          // 지도 옵션
          const options = {
            center: position,
            level: 3, // 줌 레벨 (가까이)
          };

          // 지도 생성
          const map = new window.kakao.maps.Map(mapRef.current, options);

          // 마커 생성
          const marker = new window.kakao.maps.Marker({
            position: position,
            map: map,
          });

          // 인포윈도우 생성
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="padding: 20px; min-width: 250px; text-align: center;">
                <div style="font-size: 18px; font-weight: 700; color: #3b6c55; margin-bottom: 8px;">
                  냉파고 본사
                </div>
                <div style="font-size: 14px; color: #666; line-height: 1.6;">
                  부산파이낸스센터 4층
                </div>
              </div>
            `,
          });

          // 인포윈도우 표시
          infowindow.open(map, marker);

          // 줌 컨트롤 추가
          const zoomControl = new window.kakao.maps.ZoomControl();
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        }
      });
    };

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <section className={styles.mapSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>약도</h2>
        </div>
        <div ref={mapRef} className={styles.map} />
      </div>
    </section>
  );
};

export default LocationMap;
