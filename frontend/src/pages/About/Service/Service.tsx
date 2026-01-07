import React from "react";
import ServiceHero from "@/pages/About/components/ServiceHero/ServiceHero";
import AppDownload from "@/pages/About/components/AppDownload/AppDownload";
import ServiceSteps from "@/pages/About/components/ServiceSteps/ServiceSteps";
import styles from "./Service.module.css";

const Service: React.FC = () => {
  return (
    <main className={styles.siteMain}>
      {/* 서비스 히어로 섹션 */}
      <ServiceHero />

      {/* 앱 다운로드 섹션 */}
      <AppDownload />

      {/* 서비스 이용 단계 섹션 */}
      <ServiceSteps />
    </main>
  );
};

export default Service;

