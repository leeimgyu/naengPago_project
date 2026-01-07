import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NotificationHeader } from '../NotificationHeader/NotificationHeader';
import { NotificationTabs, type NotificationTab } from '../NotificationTabs/NotificationTabs';
import { NotificationList } from '../NotificationList/NotificationList';
import type { NotificationData } from '../NotificationItem/NotificationItem';
import styles from './NotificationPanel.module.css';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const { expiringItems, recentNotices } = useAuth();
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // 유통기한 임박 재료와 공지사항을 알림 데이터로 변환
  useEffect(() => {
    // 유통기한 알림
    const expirationNotifications: NotificationData[] = expiringItems.map((item) => {
      let title = '';
      let timestamp = '';

      if (item.daysRemaining === 0) {
        title = '유통기한 오늘까지!';
        timestamp = '오늘';
      } else if (item.daysRemaining < 0) {
        title = '유통기한 만료';
        timestamp = `${Math.abs(item.daysRemaining)}일 전`;
      } else {
        title = `유통기한 D-${item.daysRemaining}`;
        timestamp = `${item.daysRemaining}일 남음`;
      }

      return {
        id: `expiration-${item.id}`,
        type: 'expiration' as const,
        title,
        message: `${item.name}${item.quantity ? ` (${item.quantity})` : ''}의 유통기한이 임박했습니다.`,
        actionLabel: '내 냉장고 보기',
        actionUrl: '/mypage',
        timestamp,
        isRead: false,
        // daysRemaining이 작을수록 긴급하므로 역산 (D-0이 가장 최근으로 취급)
        sortDate: new Date(Date.now() - item.daysRemaining * 24 * 60 * 60 * 1000),
      };
    });

    // 공지사항 알림 추가
    const noticeNotifications: NotificationData[] = recentNotices.map((notice) => {
      // 작성일 기준 시간 계산
      const createdDate = new Date(notice.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let timestamp = '';
      if (diffHours < 1) {
        timestamp = '방금 전';
      } else if (diffHours < 24) {
        timestamp = `${diffHours}시간 전`;
      } else {
        timestamp = `${diffDays}일 전`;
      }

      return {
        id: `notice-${notice.id}`,
        type: 'recipe' as const,
        title: `[${notice.category}] 새 공지사항`,
        message: notice.title,
        actionLabel: '공지사항 보기',
        actionUrl: `/notice/${notice.id}`,
        timestamp,
        isRead: false,
        sortDate: createdDate,  // 공지사항 작성일로 정렬
      };
    });

    // 유통기한 알림과 공지사항 알림 합치고 최신순 정렬
    const allNotifications = [...expirationNotifications, ...noticeNotifications];

    // sortDate 기준 내림차순 정렬 (최신이 위로)
    allNotifications.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

    // 디버깅 로그 (개발 중 확인용)
    console.log('🔔 알림 정렬 결과:', allNotifications.map(n => ({
      title: n.title,
      message: n.message,
      timestamp: n.timestamp,
      sortDate: n.sortDate.toISOString()
    })));

    setNotifications(allNotifications);
  }, [expiringItems, recentNotices]);

  const handleMarkAllRead = () => {
    // 모든 알림 삭제
    setNotifications([]);
  };

  const handleActionClick = (notification: NotificationData) => {
    console.log('🔔 Action clicked:', notification);

    // React Router를 사용하여 SPA 방식으로 페이지 이동
    if (notification.actionUrl) {
      // 공지사항인 경우 (/notice/:id), ID를 추출하여 state로 전달
      if (notification.actionUrl.startsWith('/notice/')) {
        const noticeId = notification.actionUrl.split('/notice/')[1];
        console.log('🔔 Navigating to notice page with ID:', noticeId);
        navigate('/notice', { state: { noticeId: parseInt(noticeId) } });
      }
      // 마이페이지인 경우, 내 냉장고 탭으로 이동
      else if (notification.actionUrl === '/mypage') {
        console.log('🔔 Navigating to mypage fridge tab');
        navigate('/mypage', { state: { tab: 'fridge' } });
      }
      // 그 외의 경로는 그대로 이동
      else {
        console.log('🔔 Navigating to:', notification.actionUrl);
        navigate(notification.actionUrl);
      }
      onClose();  // 알림 패널 닫기
    }
  };

  const handleViewAll = () => {
    // 전체 탭으로 이동
    setActiveTab('all');
    console.log('View all notifications');
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'expiration') return n.type === 'expiration';
    if (activeTab === 'recipe') return n.type === 'recipe';  // 공지사항 필터링
    return true;
  });

  // 유통기한이 지난 재료 개수 계산
  const expiredItemsCount = expiringItems.filter(item => item.daysRemaining < 0).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />
      
      {/* Notification Panel */}
      <div className={styles.panel}>
        {/* Speech bubble arrow */}
        <div className={styles.arrowBorder} />
        <div className={styles.arrow} />
        
        <NotificationHeader onMarkAllRead={handleMarkAllRead} />
        <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 유통기한 탭에서만 만료 재료 안내 섹션 표시 */}
        {activeTab === 'expiration' && expiredItemsCount > 0 && (
          <div className={styles.expiredSection}>
            <div className={styles.expiredHeader}>
              <span className={styles.expiredIcon}>⚠️</span>
              <div className={styles.expiredInfo}>
                <p className={styles.expiredTitle}>
                  유통기한이 지난 재료가 <strong>{expiredItemsCount}개</strong> 있습니다
                </p>
                <p className={styles.expiredMessage}>내 냉장고를 관리해주세요</p>
              </div>
            </div>
            <button
              className={styles.goToFridge}
              onClick={() => {
                navigate('/mypage', { state: { tab: 'fridge' } });
                onClose();
              }}
            >
              내 냉장고 보기
            </button>
          </div>
        )}

        <NotificationList
          notifications={filteredNotifications}
          onActionClick={handleActionClick}
        />
        
        {/* View All Button */}
        <button
          className={styles.viewAll}
          onClick={handleViewAll}
        >
          모든 알림 보기
        </button>
      </div>
    </>
  );
}