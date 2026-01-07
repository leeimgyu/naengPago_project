/**
 * About Page Component
 * @description 냉파고 소개 페이지
 */

import React from "react";
import AboutHero from "@/pages/About/components/AboutHero/AboutHero";
import ValueCards from "@/pages/About/components/ValueCards/ValueCards";
import styles from "./Greeting.module.css"

const About: React.FC = () => {
  return (
    <main className={styles.siteMain}>
      {/* CEO 인사말 섹션 */}
      <AboutHero />

      {/* 미래가치 & 솔루션 섹션 */}
      <ValueCards />
    </main>
  );
};

export default About;
