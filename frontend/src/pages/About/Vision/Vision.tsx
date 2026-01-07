/**
 * Vision Page Component
 * @description 냉파고의 미래 비전 페이지
 */

import React from "react";
import VisionHero from "../components/VisionHero/VisionHero";
import VisionContent from "../components/VisionContent/VisionContent";
import styles from "./Vision.module.css";

const Vision: React.FC = () => {
  return (
    <main className={styles.siteMain}>
      {/* 비전 히어로 섹션 */}
      <VisionHero />

      {/* 비전 콘텐츠 섹션 (지그재그 레이아웃) */}
      <VisionContent />
    </main>
  );
};

export default Vision;
