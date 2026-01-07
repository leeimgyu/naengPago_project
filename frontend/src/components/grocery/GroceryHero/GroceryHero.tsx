/**
 * Grocery Hero Component
 * @description 식료품점 찾기 페이지의 히어로 섹션
 */

import React from 'react';
import styles from './GroceryHero.module.css';

const GroceryHero: React.FC = () => {
  return (
    <section className={styles.groceryHeroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            신선한 재료,
            <br />
            <span className={styles.highlight}>가까운 곳</span>에서 찾으세요
          </h1>
          <p className={styles.heroSubtitle}>
            냉파고가 추천하는 주변 마트와 식료품점에서
            <br />
            신선하고 품질 좋은 식재료를 만나보세요.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GroceryHero;
