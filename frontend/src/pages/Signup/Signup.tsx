/**
 * Signup Page Component
 * @description 회원가입 페이지
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignupHero from './components/SignupHero/SignupHero';
import SignupForm from './components/SignupForm/SignupForm';
import SocialLogin from '@/components/auth/SocialLogin/SocialLogin';
import SuccessModal from './components/SuccessModal/SuccessModal';
import styles from './Signup.module.css';

const Signup: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleSignupSuccess = () => {
    setShowSuccessModal(true);
  };

  return (
    <main className={styles.siteMain}>
      {/* Hero Section */}
      <SignupHero />

      {/* Signup Form Section */}
      <section className={styles.signupFormSection}>
        <div className={styles.container}>
          <div className={styles.signupCard}>
            <h2 className={styles.formTitle}>회원가입</h2>
            <p className={styles.formSubtitle}>냉파고의 다양한 서비스를 이용하세요</p>

            {/* Signup Form */}
            <SignupForm onSuccess={handleSignupSuccess} />

            {/* Login Link */}
            <div className={styles.formFooter}>
              <p>
                이미 계정이 있으신가요? <Link to="/login">로그인</Link>
              </p>
            </div>

            {/* Social Signup */}
            <div className={styles.socialSignup}>
              <SocialLogin signupMode />
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </main>
  );
};

export default Signup;
