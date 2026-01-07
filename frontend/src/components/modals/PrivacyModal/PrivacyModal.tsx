/**
 * Privacy Policy Modal Component
 * @description 개인정보처리방침 모달
 */

import React from 'react';
import styles from './PrivacyModal.module.css';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>개인정보처리방침</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <section>
            <h3>1. 개인정보의 수집 및 이용목적</h3>
            <p>
              냉파고(이하 '회사')는 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
              이용 목적이 변경되는 경우에는 개인정보 보호법에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul>
              <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
              <li>재화 또는 서비스 제공: 서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공</li>
              <li>마케팅 및 광고 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공</li>
            </ul>
          </section>

          <section>
            <h3>2. 수집하는 개인정보 항목</h3>
            <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <ul>
              <li>필수항목: 이름, 이메일, 비밀번호</li>
              <li>선택항목: 전화번호, 주소</li>
              <li>자동수집항목: IP주소, 쿠키, 서비스 이용 기록, 접속 로그</li>
            </ul>
          </section>

          <section>
            <h3>3. 개인정보의 보유 및 이용기간</h3>
            <p>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
              동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul>
              <li>회원 정보: 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</li>
              <li>서비스 이용 기록: 3년</li>
            </ul>
          </section>

          <section>
            <h3>4. 개인정보의 제3자 제공</h3>
            <p>
              회사는 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만
              개인정보를 제3자에게 제공합니다.
            </p>
          </section>

          <section>
            <h3>5. 개인정보처리의 위탁</h3>
            <p>
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <ul>
              <li>수탁업체: AWS (Amazon Web Services)</li>
              <li>위탁업무: 서버 호스팅 및 데이터 보관</li>
            </ul>
          </section>

          <section>
            <h3>6. 정보주체의 권리·의무 및 행사방법</h3>
            <p>
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul>
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          <section>
            <h3>7. 개인정보 보호책임자</h3>
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
              정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <ul>
              <li>개인정보 보호책임자: 정재헌</li>
              <li>이메일: privacy@naengpago.com</li>
              <li>전화번호: 02-1234-5678</li>
            </ul>
          </section>

          <p className={styles.updateDate}>
            본 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.
          </p>
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

export default PrivacyModal;
