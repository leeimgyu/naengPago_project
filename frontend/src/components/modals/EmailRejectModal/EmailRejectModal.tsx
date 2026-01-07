/**
 * Email Collection Rejection Modal Component
 * @description 이메일수집거부 모달
 */

import React from 'react';
import styles from './EmailRejectModal.module.css';

interface EmailRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailRejectModal: React.FC<EmailRejectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>이메일 무단수집 거부</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <section className={styles.warningSection}>
            <div className={styles.warningIcon}>⚠️</div>
            <h3>본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 정보통신망법에 의해 형사 처벌됨을 유념하시기 바랍니다.</h3>
          </section>

          <section>
            <h4>관련 법률</h4>
            <div className={styles.lawSection}>
              <h5>정보통신망 이용촉진 및 정보보호 등에 관한 법률</h5>
              <p><strong>제50조의2 (전자우편주소의 무단 수집행위 등 금지)</strong></p>
              <ol>
                <li>
                  누구든지 인터넷 홈페이지 운영자 또는 관리자의 사전 동의 없이 인터넷 홈페이지에서 자동으로
                  전자우편주소를 수집하는 프로그램이나 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니 된다.
                </li>
                <li>
                  누구든지 제1항을 위반하여 수집된 전자우편주소를 판매·유통하여서는 아니 된다.
                </li>
                <li>
                  누구든지 제1항 및 제2항을 위반하여 수집·판매 및 유통이 금지된 전자우편주소임을 알고
                  이를 정보 전송에 이용하여서는 아니 된다.
                </li>
              </ol>
            </div>

            <div className={styles.penaltySection}>
              <h5>제74조 (벌칙)</h5>
              <p>
                다음 각 호의 어느 하나에 해당하는 자는 1년 이하의 징역 또는 1천만원 이하의 벌금에 처한다.
              </p>
              <ul>
                <li>제50조제6항을 위반하여 기술적 조치를 한 자</li>
                <li>제50조의2를 위반하여 전자우편주소를 수집·판매·유통 또는 정보전송에 이용한 자</li>
              </ul>
            </div>
          </section>

          <section className={styles.contactSection}>
            <h4>이메일 문의</h4>
            <p>
              냉파고는 고객님의 개인정보를 소중히 여기며, 합법적인 방법으로만 이메일을 수집하고 있습니다.
            </p>
            <p>
              문의사항이 있으시면 아래의 공식 이메일로 연락 주시기 바랍니다.
            </p>
            <div className={styles.emailBox}>
              <strong>공식 문의 이메일:</strong> contact@naengpago.com
            </div>
          </section>

          <section className={styles.noticeSection}>
            <h4>안내사항</h4>
            <ul>
              <li>본 사이트는 이메일 주소 무단 수집을 거부합니다.</li>
              <li>이메일 주소는 회원가입 시 본인이 직접 입력한 정보만 수집됩니다.</li>
              <li>수집된 이메일은 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다.</li>
              <li>회원 탈퇴 시 수집된 이메일 정보는 즉시 파기됩니다.</li>
            </ul>
          </section>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.confirmButton} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailRejectModal;
