import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NoticeActions.module.css';

const NoticeActions: React.FC = () => {
  return (
    <Link to="/notice/register">
      <button className={styles.registerBtn}>등록</button>
    </Link>
  );
};

export default NoticeActions;
