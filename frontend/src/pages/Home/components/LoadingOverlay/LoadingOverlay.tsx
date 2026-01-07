/**
 * Loading Overlay Component
 * @description 페이지 로딩 시 표시되는 오버레이
 */

import React, { useEffect, useState } from 'react';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  const [shouldRender, setShouldRender] = useState<boolean>(visible);
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    if (!visible) {
      // 페이드아웃 애니메이션 시작
      setOpacity(0);

      // 애니메이션 완료 후 DOM에서 제거
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
      setOpacity(1);
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div
      id="loading-overlay"
      className={styles.loadingOverlay}
      style={{ opacity }}
    >
      <div className={styles.loadingContent}>
        <h2>Every meal starts in your fridge.</h2>
        <p>모든 요리는 냉장고에서 시작된다</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
