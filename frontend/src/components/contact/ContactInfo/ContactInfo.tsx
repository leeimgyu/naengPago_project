/**
 * Contact Info Component
 * @description 연락처 정보 카드 섹션
 */

import React from 'react';
import styles from './ContactInfo.module.css';

interface ContactCard {
  id: string;
  category: string;
  title: string;
  content: string;
  detail: string;
}

const contactData: ContactCard[] = [
  {
    id: '1',
    category: '고객센터',
    title: '전화 문의',
    content: '1588-0000',
    detail: '평일 09:00 - 18:00 (주말 및 공휴일 휴무)',
  },
  {
    id: '2',
    category: '이메일',
    title: '이메일 문의',
    content: 'support@naengpago.com',
    detail: '24시간 접수 가능 (답변은 평일 기준 1-2일 소요)',
  },
  {
    id: '3',
    category: '제휴 문의',
    title: '비즈니스 제휴',
    content: 'partnership@naengpago.com',
    detail: '기업 및 비즈니스 제휴 관련 문의',
  },
  {
    id: '4',
    category: '주소',
    title: '본사 위치',
    content: '서울특별시 강남구 테헤란로 123',
    detail: '냉파고 본사 (냉파고빌딩 5층)',
  },
];

const ContactInfo: React.FC = () => {
  return (
    <section className={styles.contactInfoSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>연락처 정보</h2>
          <p className={styles.sectionSubtitle}>
            다양한 방법으로 냉파고에 연락하실 수 있습니다
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {contactData.map((card) => (
            <div key={card.id} className={styles.contactCard}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{card.category}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.mainContent}>{card.content}</p>
                <p className={styles.detailContent}>{card.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.additionalInfo}>
          <div className={styles.infoBox}>
            <h4 className={styles.infoTitle}>업무 시간</h4>
            <p className={styles.infoText}>
              평일: 09:00 - 18:00
              <br />
              점심시간: 12:00 - 13:00
              <br />
              주말 및 공휴일: 휴무
            </p>
          </div>
          <div className={styles.infoBox}>
            <h4 className={styles.infoTitle}>빠른 응답을 위한 팁</h4>
            <p className={styles.infoText}>
              문의 시 회원 정보와 문제 상황을 상세히 기재해주시면
              <br />
              더욱 빠르고 정확한 답변을 받으실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
