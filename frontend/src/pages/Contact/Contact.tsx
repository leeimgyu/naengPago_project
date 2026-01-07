/**
 * Contact Page Component
 * @description 고객센터 1:1 문의 페이지
 */

import React from 'react';
import ContactHero from '../../components/contact/ContactHero/ContactHero';
import FAQ from '../../components/contact/FAQ/FAQ';
import ContactForm from '../../components/contact/ContactForm/ContactForm';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
  return (
    <main className={styles.contactPage}>
      {/* Hero Section */}
      <ContactHero />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Form Section (통합 폼: 문의 작성 + 연락처 정보) */}
      <ContactForm />
    </main>
  );
};

export default Contact;
