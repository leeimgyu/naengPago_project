/**
 * Service Panel Component
 * @description 서비스 배너의 개별 패널
 */

import React from 'react';
import type { ServicePanel as ServicePanelProps } from '@/types';
import styles from './ServiceBanner.module.css';

interface ServicePanelComponentProps extends ServicePanelProps {
  isActive: boolean;
}

const ServicePanel: React.FC<ServicePanelComponentProps> = ({
  image,
  titleTop,
  titleBottom,
  taglineTop,
  taglineBottom,
  isActive
}) => {
  return (
    <div className={`${styles.serviceSlideItem} ${isActive ? styles.active : ''}`}>
      <div className={styles.container}>
        <div className={styles.serviceBannerContent}>
          <img
            className={styles.serviceBanner}
            src={image}
            alt="서비스 배너"
            loading="lazy"
            width="1920"
            height="1080"
          />
          <div className={`${styles.overlayText} ${styles.overlayTopLeft}`}>
            &quot;{titleTop}
            <br />
            {titleBottom}&quot;
          </div>
          <div className={`${styles.overlayText} ${styles.overlayBottomRight}`}>
            <span className={styles.rightTopText}>{taglineTop}</span>
            <span className={styles.rightBottomText}>{taglineBottom}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePanel;
