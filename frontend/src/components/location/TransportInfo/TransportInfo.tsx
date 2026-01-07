/**
 * Transport Info Component
 * @description 교통편 안내 (지하철, 버스, 자가용, 도보)
 */

import React from 'react';
import styles from './TransportInfo.module.css';

interface TransportMethod {
  id: string;
  icon: string;
  title: string;
  description: string[];
}

const transportMethods: TransportMethod[] = [
  {
    id: '1',
    icon: '🚇',
    title: '지하철',
    description: [
      '부산 지하철 1호선 서면역 7번 출구',
      '부산 지하철 2호선 서면역 7번 출구',
      '도보 약 5분 소요',
    ],
  },
  {
    id: '2',
    icon: '🚌',
    title: '버스',
    description: [
      '일반버스: 5-1, 15, 16, 33, 51, 52, 83-1, 131',
      '급행버스: 1000, 1001, 1002',
      '정류장: 서면역 하차',
    ],
  },
  {
    id: '3',
    icon: '🚗',
    title: '자가용',
    description: [
      '경부고속도로 → 서면 IC → 중앙대로 방면',
      '부산파이낸스센터 지하주차장 이용 (유료)',
      '주차장 입구: 중앙대로 진입',
    ],
  },
  {
    id: '4',
    icon: '🚶',
    title: '도보',
    description: [
      '서면역 7번 출구에서 직진 200m',
      '부산파이낸스센터 빌딩 진입',
      '엘리베이터 이용 → 4층',
    ],
  },
];

const TransportInfo: React.FC = () => {
  return (
    <section className={styles.transportSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>교통편 안내</h2>
          <p className={styles.sectionSubtitle}>
            다양한 교통수단으로 편리하게 방문하실 수 있습니다
          </p>
        </div>

        <div className={styles.transportGrid}>
          {transportMethods.map((method) => (
            <div key={method.id} className={styles.transportCard}>
              <div className={styles.cardIcon}>{method.icon}</div>
              <h3 className={styles.cardTitle}>{method.title}</h3>
              <ul className={styles.descriptionList}>
                {method.description.map((item, index) => (
                  <li key={index} className={styles.descriptionItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.contactBox}>
          <p className={styles.contactTitle}>문의사항이 있으신가요?</p>
          <p className={styles.contactInfo}>
            📞 대표전화: <strong>1588-0000</strong> | 📧 이메일:{' '}
            <strong>support@naengpago.com</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TransportInfo;
