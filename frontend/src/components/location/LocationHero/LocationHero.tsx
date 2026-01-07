/**
 * Location Hero Component
 * @description 오시는 길 페이지 Hero 섹션
 */

import React from 'react';
import styles from './LocationHero.module.css';

const LocationHero: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <span className={styles.highlight}>오시는 길</span>
        </h1>
        <p className={styles.heroSubtitle}>
          냉파고를 방문해 주셔서 감사합니다
        </p>
        <div className={styles.addressBox}>
          <p className={styles.addressLabel}>본사 위치</p>
          <p className={`${styles.addressText} ${styles.addressDetailText}`}>
            부산광역시 부산진구 중앙대로 708<br />
            부산파이낸스센터 4층
          </p>
        </div>
      </div>
    </section>
  );
};

export default LocationHero;
