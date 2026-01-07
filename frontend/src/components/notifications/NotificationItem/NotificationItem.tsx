import { AlertCircle, ChefHat, Gift } from 'lucide-react';
import styles from './NotificationItem.module.css';

export interface NotificationData {
  id: string;
  type: 'expiration' | 'recipe' | 'event';
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  timestamp: string;
  isRead: boolean;
  sortDate: Date;  // 정렬용 날짜 필드
}

interface NotificationItemProps {
  notification: NotificationData;
  onAction?: () => void;
}

export function NotificationItem({ notification, onAction }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'expiration':
        return (
          <div className={`${styles.icon} ${styles.expiration}`}>
            <AlertCircle />
          </div>
        );
      case 'recipe':
        return (
          <div className={`${styles.icon} ${styles.recipe}`}>
            <ChefHat />
          </div>
        );
      case 'event':
        return (
          <div className={`${styles.icon} ${styles.event}`}>
            <Gift />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.item}>
      {getIcon()}
      <div className={styles.content}>
        <div className={styles.itemHeader}>
          <p className={styles.title}>{notification.title}</p>
          <span className={styles.timestamp}>{notification.timestamp}</span>
        </div>
        <p className={styles.message}>{notification.message}</p>
        {notification.actionLabel && (
          <button onClick={onAction} className={styles.action}>
            {notification.actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
}
