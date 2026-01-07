/**
 * Ingredients Slider Component
 * @description 재료 정보 슬라이더
 */

import React, { useState, useRef, useEffect } from 'react';
import IngredientCard from './IngredientCard';
import type { IngredientCard as IngredientCardType } from '@/types';
import styles from './IngredientsSlider.module.css';
import marketImage from '@/assets/image/ingredients/market.jpg';
import recipeImage from '@/assets/image/ingredients/recipe.jpg';
import ingredientImage from '@/assets/image/ingredients/ingredient.jpg';
import arrowLeft from '@/assets/image/icon/arrow-left.png';
import arrowRight from '@/assets/image/icon/arrow-right.png';

const ingredientsData: IngredientCardType[] = [
  {
    image: marketImage,
    title: '구매처 추천',
    subtitle: '더 이상 검색할 필요 없어요 — 구매 가능한 곳을 바로 보여드립니다.'
  },
  {
    image: recipeImage,
    title: '나만을 위한 요리 조합',
    subtitle: '재료를 낭비하지 않는 똑똑한 요리 도우미.'
  },
  {
    image: ingredientImage,
    title: '유통기한 관리',
    subtitle: '버리기 전에 지켜주는 똑똑한 냉장고 비서.'
  }
];

const IngredientsSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateSlider = () => {
    if (!sliderTrackRef.current || !slideRefs.current[0]) return;

    const slideWidth = slideRefs.current[0].offsetWidth;
    const slideMargin = parseInt(
      window.getComputedStyle(slideRefs.current[0]).marginRight,
      10
    );
    const totalMove = slideWidth + slideMargin;

    sliderTrackRef.current.style.transform = `translateX(-${currentSlide * totalMove}px)`;
  };

  useEffect(() => {
    updateSlider();

    const handleResize = () => updateSlider();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [currentSlide]);

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % ingredientsData.length);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + ingredientsData.length) % ingredientsData.length);
  };

  return (
    <section className={styles.ingredientsSection}>
      <div className={`${styles.container} ${styles.containerFullRight}`}>
        <h2 className={styles.sectionTitle}>Ingredients</h2>

        <div className={styles.ingredientsSliderContainer}>
          <div className={styles.ingredientsBoxWrap}>
            <div className={styles.ingredientsSliderTrack} ref={sliderTrackRef}>
              {ingredientsData.map((ingredient, index) => (
                <IngredientCard
                  key={index}
                  {...ingredient}
                  ref={(el: HTMLDivElement | null) => { slideRefs.current[index] = el; }}
                />
              ))}
            </div>
          </div>

          <div className={styles.arrowBox}>
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              type="button"
            >
              <img src={arrowLeft} alt="Previous" />
            </button>
            <span>
              <span className={styles.currentSlide}>{currentSlide + 1}</span> /{' '}
              <span id="slide-total">{ingredientsData.length}</span>
            </span>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              type="button"
            >
              <img src={arrowRight} alt="Next" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IngredientsSlider;
