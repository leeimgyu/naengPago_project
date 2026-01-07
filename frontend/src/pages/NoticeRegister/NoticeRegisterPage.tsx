import React from 'react';
import { Link } from 'react-router-dom';
import NoticeRegisterForm from './components/NoticeRegisterForm/NoticeRegisterForm';
import styles from './NoticeRegisterPage.module.css';

const NoticeRegisterPage: React.FC = () => {
    return (
        <div className={styles.NoticeEditPageContainer}>
            <div className={styles.Header}>
                <Link to="/">Home</Link>
                <span>›</span>
                <Link to="/notice">공지사항</Link>
                <span>›</span>
                <span className={styles.current}>등록</span>
            </div>
            <div className={styles.ContentWrapper}>
                <div className={styles.ContentHeader}>
                    <h1>공지사항 등록</h1>
                </div>
                <NoticeRegisterForm />
            </div>
        </div>
    );
};

export default NoticeRegisterPage;
