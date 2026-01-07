import { NotificationItem, type NotificationData } from '../NotificationItem/NotificationItem';
import styles from './NotificationList.module.css';

interface NotificationListProps {
  notifications: NotificationData[];
  onActionClick?: (notification: NotificationData) => void;
}

export function NotificationList({ notifications, onActionClick }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className={styles.empty}>
        알림이 없습니다
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onAction={() => onActionClick?.(notification)}
        />
      ))}
    </div>
  );
}
