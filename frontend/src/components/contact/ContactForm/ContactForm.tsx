/**
 * Contact Form Component
 * @description 1:1 문의 작성 및 빠른 연락처 정보를 통합한 폼 컴포넌트
 *
 * 주요 기능:
 * 1. 사용자 문의 작성 (카테고리, 제목, 내용)
 * 2. 로그인 사용자 기준으로 개인정보 필드 제외 (이름, 이메일, 전화번호 불필요)
 * 3. 폼 하단에 빠른 연락처 정보 4가지 표시 (고객센터, 이메일, 제휴문의, 본사위치)
 * 4. 하나의 통합 배경 및 테두리로 시각적 일관성 제공
 *
 * @example
 * <ContactForm />
 */

import React, { useState } from 'react';
import styles from './ContactForm.module.css';

/**
 * 문의 폼 데이터 인터페이스
 * @property {string} category - 문의 유형 (서비스, 레시피, 계정, 기술지원, 제휴, 기타)
 * @property {string} title - 문의 제목
 * @property {string} content - 문의 내용 (상세 설명)
 */
interface InquiryFormData {
  category: string;
  title: string;
  content: string;
}

/**
 * 빠른 연락처 정보 인터페이스
 * @property {string} id - 고유 식별자
 * @property {string} label - 연락처 라벨 (예: 고객센터, 이메일)
 * @property {string} value - 연락처 값 (전화번호, 이메일 주소 등)
 */
interface QuickContact {
  id: string;
  label: string;
  value: string;
}

/**
 * 빠른 연락처 정보 배열
 * 폼 하단에 표시되는 고객 지원 연락처 정보
 */
const quickContacts: QuickContact[] = [
  {
    id: '1',
    label: '고객센터',
    value: '1588-0000',
  },
  {
    id: '2',
    label: '이메일',
    value: 'support@naengpago.com',
  },
  {
    id: '3',
    label: '제휴문의',
    value: 'partnership@naengpago.com',
  },
  {
    id: '4',
    label: '본사위치',
    value: '서울특별시 강남구 테헤란로 123',
  },
];

const ContactForm: React.FC = () => {
  // 폼 입력 상태 관리 (카테고리, 제목, 내용)
  const [formData, setFormData] = useState<InquiryFormData>({
    category: '',
    title: '',
    content: '',
  });

  /**
   * 입력 필드 변경 핸들러
   * @param {ChangeEvent} e - 입력 이벤트
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * 폼 제출 핸들러
   *
   * 동작:
   * 1. 기본 폼 제출 동작 방지
   * 2. 문의 내용을 콘솔에 로그 (TODO: 백엔드 API 연동 필요)
   * 3. 사용자에게 접수 완료 알림
   * 4. 폼 입력값 초기화
   *
   * @param {FormEvent} e - 폼 제출 이벤트
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 백엔드 API 연동 (POST /api/contact/inquiry)
    console.log('문의 내용:', formData);
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');

    // 폼 초기화
    setFormData({
      category: '',
      title: '',
      content: '',
    });
  };

  return (
    <section className={styles.contactFormSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>1:1 문의 글 작성</h2>
          <p className={styles.sectionSubtitle}>
            궁금하신 사항을 남겨주시면 빠르게 답변드리겠습니다
          </p>
        </div>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          {/* 문의 작성 섹션 */}
          <div className={styles.inquirySection}>
            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                문의 유형 <span className={styles.required}>*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">문의 유형을 선택해주세요</option>
                <option value="service">서비스 이용 문의</option>
                <option value="recipe">레시피 관련 문의</option>
                <option value="account">계정/회원 문의</option>
                <option value="technical">기술 지원</option>
                <option value="partnership">제휴 문의</option>
                <option value="etc">기타</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                제목 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={styles.input}
                placeholder="문의 제목을 입력해주세요"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content" className={styles.label}>
                문의 내용 <span className={styles.required}>*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="문의하실 내용을 자세히 입력해주세요"
                rows={10}
                required
              />
            </div>
          </div>

          {/* 연락처 정보 섹션 */}
          <div className={styles.quickInfoSection}>
            <h3 className={styles.quickInfoTitle}>빠른 연락처</h3>
            <div className={styles.infoGrid}>
              {quickContacts.map((contact) => (
                <div key={contact.id} className={styles.contactItem}>
                  <span className={styles.contactLabel}>{contact.label}</span>
                  <span className={styles.contactValue}>{contact.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className={styles.formFooter}>
            <p className={styles.privacyNotice}>
              문의 접수 시 개인정보 수집 및 이용에 동의하신 것으로 간주됩니다.
            </p>
            <button type="submit" className={styles.submitButton}>
              문의 등록하기
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
