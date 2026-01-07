/**
 * Vision Hero Component
 * @description 비전 페이지 히어로 섹션
 */

import React from 'react';
import styles from './VisionHero.module.css';

const VisionHero: React.FC = () => {
  return (
    <section className={styles.visionHeroSection}>
      <div className={styles.heroOverlay}>
        <h2 className={styles.heroTitle}>Our Vision</h2>
        <p className={styles.heroSubtitle}>
          냉파고가 그리는 미래
        </p>
        <p className={styles.heroDescription}>
          스마트한 식생활과 지속 가능한 미래를 향한 우리의 비전을 소개합니다
        </p>
      </div>
    </section>
  );
};

export default VisionHero;
