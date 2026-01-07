import React from 'react';
import styles from './RecipeHero.module.css';

const RecipeHero: React.FC = () => {
  return (
    <section className={styles.recipeHeroSection}>
      <div className={styles.heroOverlay}>
        <h2 className={styles.heroTitle}>All Recipes</h2>
        <p className={styles.heroSubtitle}>
          건강한 한 주를 시작하는 레시피를 모두 찾아보세요
        </p>
        <p className={styles.heroDescription}>
          당신의 식탁을 풍성하게 만들어 줄 레시피들을 만나보세요.
        </p>
      </div>
    </section>
  );
};

export default RecipeHero;
