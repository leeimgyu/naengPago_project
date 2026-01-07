
import styles from './NoticeList.module.css';

interface Notice {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;
  views: string;
  content: string;
  isPinned?: boolean;
  isNew?: boolean;
}

interface NoticeListProps {
  pinnedNotices: Notice[];
  regularNotices: Notice[];
  onNoticeClick: (notice: Notice) => void;
}

function NoticeList({ pinnedNotices, regularNotices, onNoticeClick }: NoticeListProps) {
  return (
    <div className={styles.noticeBoard}>
      <table className={styles.boardTable}>
        <thead>
          <tr>
            <th className={styles.colNumber}>번호</th>
            <th className={styles.colCategory}>구분</th>
            <th className={styles.colTitle}>제목</th>
            <th className={styles.colAuthor}>작성자</th>
            <th className={styles.colDate}>등록일</th>
            <th className={styles.colViews}>조회수</th>
          </tr>
        </thead>
        <tbody>
          {pinnedNotices.map(notice => (
            <tr key={notice.id} className={styles.noticePinned} onClick={() => onNoticeClick(notice)}>
              <td className={`${styles.colNumber} ${styles.pinned}`}>📢</td>
              <td className={styles.colCategory}>
                <span className={styles.badge}>{notice.category}</span>
              </td>
              <td className={styles.colTitle}>
                <a href="#" className={`${styles.titleLink} ${notice.isNew ? styles.hasNew : ''}`}>
                  {notice.title}
                </a>
              </td>
              <td className={styles.colAuthor}>{notice.author}</td>
              <td className={styles.colDate}>{notice.date}</td>
              <td className={styles.colViews}>{notice.views}</td>
            </tr>
          ))}
          {regularNotices.map(notice => (
            <tr key={notice.id} onClick={() => onNoticeClick(notice)}>
              <td className={styles.colNumber}>{notice.id}</td>
              <td className={styles.colCategory}>
                <span className={styles.badge}>{notice.category}</span>
              </td>
              <td className={styles.colTitle}>
                <a href="#" className={`${styles.titleLink} ${notice.isNew ? styles.hasNew : ''}`}>
                  {notice.title}
                </a>
              </td>
              <td className={styles.colAuthor}>{notice.author}</td>
              <td className={styles.colDate}>{notice.date}</td>
              <td className={styles.colViews}>{notice.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NoticeList;
