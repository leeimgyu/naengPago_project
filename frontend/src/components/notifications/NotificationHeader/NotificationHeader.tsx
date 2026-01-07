import styles from './NotificationHeader.module.css';

interface NotificationHeaderProps {
  onMarkAllRead: () => void;
}

export function NotificationHeader({ onMarkAllRead }: NotificationHeaderProps) {
  return (
    <div className={styles.header}>
      <h3>알림</h3>
      <button onClick={onMarkAllRead} className={styles.markReadButton}>
        모두 읽음
      </button>
    </div>
  );
}
