import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import footerLogo from '../../../assets/image/logo/footer-logo.png'
import youtubeIcon from '../../../assets/image/icon/youtube.png'
import instagramIcon from '../../../assets/image/icon/instagram.png'
import facebookIcon from '../../../assets/image/icon/facebook.png'
import PrivacyModal from '../../modals/PrivacyModal/PrivacyModal'
import EmailRejectModal from '../../modals/EmailRejectModal/EmailRejectModal'

function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isEmailRejectModalOpen, setIsEmailRejectModalOpen] = useState(false)

  return (
    <>
      <footer className={styles.siteFooter}>
        <div className={`${styles.container} ${styles.footerContainer}`}>

          <div className={styles.footerLogoBox}>
            <Link to="/">
              <img
                className={styles.footerLogoImg}
                src={footerLogo}
                alt="냉파고 로고"
              />
              <span>aengpago</span>
            </Link>
            <p className={styles.footerTagline}>Smart Kitchen Mate</p>
          </div>

          <div className={styles.footerInfoWrap}>
            <nav className={styles.footerLinks}>
              <Link to="/about">회사소개</Link>
              <button onClick={() => setIsPrivacyModalOpen(true)} className={styles.footerLink}>
                개인정보처리방침
              </button>
              <button onClick={() => setIsEmailRejectModalOpen(true)} className={styles.footerLink}>
                이메일수집거부
              </button>
            </nav>
          <div className={styles.footerAddress}>
            <p>
              <span>업체명: (주) naengpago</span>
              <span>대표자: 정재헌</span>
              <span>사업자등록번호: 123-45-67890</span>
            </p>
            <p>
              <span>주소: 부산 광역시 센텀대로 123-77</span>
            </p>
          </div>
          <p className={styles.footerCopyright}>
            COPYRIGHT © NAENGPAGO. ALL RIGHTS RESERVED.
          </p>
        </div>

        <div className={styles.footerSocialIcons}>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <img src={youtubeIcon} alt="YouTube" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <img src={facebookIcon} alt="Facebook" />
          </a>
        </div>

      </div>
    </footer>

    <PrivacyModal
      isOpen={isPrivacyModalOpen}
      onClose={() => setIsPrivacyModalOpen(false)}
    />
    <EmailRejectModal
      isOpen={isEmailRejectModalOpen}
      onClose={() => setIsEmailRejectModalOpen(false)}
    />
  </>
  )
}

export default Footer
