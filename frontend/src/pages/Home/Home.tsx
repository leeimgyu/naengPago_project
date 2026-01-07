/**
 * Home Page Component
 * @description 냉파고 메인 홈페이지
 */

import React from 'react';
import { VideoSlider } from './components/VideoSlider/VideoSlider';
import ServiceBanner from './components/ServiceBanner/ServiceBanner';
import RecipeWeek from './components/RecipeWeek/RecipeWeek';
import IngredientsSlider from './components/IngredientsSlider/IngredientsSlider';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <main className={styles.siteMain}>
      {/* 비디오 슬로건 섹션 */}
      <VideoSlider />

      {/* 서비스 배너 섹션 */}
      <ServiceBanner />

      {/* 이번 주 레시피 섹션 */}
      <RecipeWeek />

      {/* 재료 슬라이더 섹션 */}
      <IngredientsSlider />
    </main>
  );
};

export default Home;
