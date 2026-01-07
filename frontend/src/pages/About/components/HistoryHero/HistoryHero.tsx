/**
 * History Hero Component
 * @description 연혁 페이지 히어로 섹션
 */

import React from 'react';
import styles from './HistoryHero.module.css';

const HistoryHero: React.FC = () => {
  return (
    <section className={styles.historyHeroSection}>
      <div className={styles.heroOverlay}>
        <h2 className={styles.heroTitle}>Our History</h2>
        <p className={styles.heroSubtitle}>
          냉파고의 성장 이야기
        </p>
        <p className={styles.heroDescription}>
          혁신적인 서비스로 스마트한 식생활 문화를 만들어온 우리의 여정
        </p>
      </div>
    </section>
  );
};

export default HistoryHero;
