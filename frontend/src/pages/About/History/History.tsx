/**
 * History Page Component
 * @description 냉파고의 연혁 페이지
 */

import React from "react";
import HistoryHero from "@/pages/About/components/HistoryHero/HistoryHero";
import HistoryTimeline from "@/pages/About/components/HistoryTimeline/HistoryTimeline";
import styles from "./History.module.css";

const History: React.FC = () => {
  return (
    <main className={styles.siteMain}>
      {/* 연혁 히어로 섹션 */}
      <HistoryHero />

      {/* 연혁 타임라인 섹션 */}
      <HistoryTimeline />
    </main>
  );
};

export default History;
