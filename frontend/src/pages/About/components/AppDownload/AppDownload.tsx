import React from 'react';
import styles from './AppDownload.module.css';
import googleStoreImg from '@/assets/image/store/google2.png';
import appleStoreImg from '@/assets/image/store/apple3.png';
import appScreenshot1 from '@/assets/image/service/loading.png';
import appScreenshot2 from '@/assets/image/service/main.png'; // app 폴덩 생성 후 수정 필요

const AppDownload: React.FC = () => {
  return (
    <section className={styles.downloadSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftContent}>
            <div className={styles.textContent}>
              <h2 className={styles.title}>냉파고 앱 다운로드</h2>
              <p className={styles.description}>
                모바일 앱으로 더욱 편리하게 냉파고 서비스를 이용하세요
              </p>
              <p className={styles.subtitle}>
                Google Play Store와 App Store에서 지금 바로 다운로드하세요
              </p>
            </div>

            <div className={styles.storeButtons}>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeButton}
              >
                <img
                  src={googleStoreImg}
                  alt="Google Play에서 다운로드"
                  className={styles.storeImage}
                />
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeButton}
              >
                <img
                  src={appleStoreImg}
                  alt="App Store에서 다운로드"
                  className={styles.storeImage}
                />
              </a>
            </div>
          </div>

          <div className={styles.appScreenshotWrapper}>
            <div className={styles.appScreenshotItem}>
              <img
                src={appScreenshot1}
                alt="냉파고 앱 화면 1"
                className={styles.appScreenshot}
              />
            </div>
            <div className={styles.appScreenshotItem}>
              <img
                src={appScreenshot2}
                alt="냉파고 앱 화면 2"
                className={styles.appScreenshot}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
