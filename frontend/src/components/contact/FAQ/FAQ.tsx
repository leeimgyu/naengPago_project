/**
 * FAQ Component
 * @description 자주 묻는 질문 섹션
 */

import React, { useState } from 'react';
import styles from './FAQ.module.css';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: '냉파고 서비스는 무료인가요?',
    answer: '네, 냉파고의 모든 레시피 검색 및 추천 서비스는 완전 무료로 제공됩니다. 회원가입 후 모든 기능을 무료로 이용하실 수 있습니다.',
  },
  {
    id: '2',
    question: '레시피 저장 기능은 어떻게 사용하나요?',
    answer: '마음에 드는 레시피 상세 페이지에서 저장 버튼을 클릭하시면 마이페이지의 저장된 레시피 목록에서 확인하실 수 있습니다.',
  },
  {
    id: '3',
    question: '재료 검색은 어떻게 하나요?',
    answer: '상단 검색창에 보유하고 있는 재료명을 입력하시면, 해당 재료로 만들 수 있는 다양한 레시피를 추천해드립니다.',
  },
  {
    id: '4',
    question: '회원 탈퇴는 어떻게 하나요?',
    answer: '마이페이지 > 계정 설정 > 회원 탈퇴 메뉴에서 진행하실 수 있습니다. 탈퇴 시 모든 저장된 데이터가 삭제되니 신중히 결정해주세요.',
  },
  {
    id: '5',
    question: '레시피 정보가 부정확한 경우 어떻게 하나요?',
    answer: '레시피 상세 페이지 하단의 신고 기능을 이용하시거나, 고객센터로 문의해주시면 빠르게 확인 후 수정하겠습니다.',
  },
  {
    id: '6',
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 페이지의 "비밀번호 찾기"를 클릭하시면 가입 시 등록하신 이메일로 비밀번호 재설정 링크를 보내드립니다.',
  },
];

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>자주 묻는 질문</h2>
          <p className={styles.sectionSubtitle}>
            냉파고 이용 시 자주 묻는 질문들을 모았습니다
          </p>
        </div>

        <div className={styles.faqList}>
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className={`${styles.faqItem} ${
                openId === faq.id ? styles.open : ''
              }`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className={styles.questionText}>Q. {faq.question}</span>
                <span className={styles.toggleIcon}>
                  {openId === faq.id ? '−' : '+'}
                </span>
              </button>
              {openId === faq.id && (
                <div className={styles.faqAnswer}>
                  <p className={styles.answerText}>A. {faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
