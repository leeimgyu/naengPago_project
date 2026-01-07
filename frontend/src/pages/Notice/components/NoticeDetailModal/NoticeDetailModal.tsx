import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { Notice } from '../../../../types';
import styles from './NoticeDetailModal.module.css';
import { incrementNoticeViews } from '@/api/noticeApi';

interface NoticeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice | null;
}

// 파일 크기 포맷팅 헬퍼 함수
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

function NoticeDetailModal({ isOpen, onClose, notice }: NoticeDetailModalProps) {
  const navigate = useNavigate();

  // 모달이 열릴 때 조회수 증가
  useEffect(() => {
    if (isOpen && notice) {
      incrementNoticeViews(notice.id).catch((error) => {
        console.error('조회수 증가 실패:', error);
      });
    }
  }, [isOpen, notice?.id]);

  if (!isOpen || !notice) {
    return null;
  }

  const handleEdit = () => {
    if (notice) {
      navigate(`/notice/edit/${notice.id}`);
    }
  };

  return (
    <div className={`${styles.modal} ${isOpen ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleArea}>
            <h2 className={styles.modalTitle}>{notice.title}</h2>
            <span className={styles.modalClose} onClick={onClose}>×</span>
          </div>
          <div className={styles.modalInfo}>
            <span><strong>작성자</strong> <span>{notice.author}</span></span>
            <span><strong>등록일</strong> <span>{notice.date}</span></span>
            <span><strong>조회수</strong> <span>{notice.views}</span></span>
          </div>
        </div>
        <div className={styles.modalBody}>
          <div dangerouslySetInnerHTML={{ __html: notice.content }}></div>

          {/* 첨부파일 섹션 */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className={styles.attachmentSection}>
              <h3 className={styles.attachmentTitle}>📎 첨부파일</h3>
              <ul className={styles.attachmentList}>
                {notice.attachments.map((file) => {
                  // /files/{filename}을 /api/files/download/{filename}으로 변환
                  const downloadUrl = file.fileUrl.replace('/files/', '/api/files/download/');
                  return (
                    <li key={file.id} className={styles.attachmentItem}>
                      <a href={downloadUrl} download={file.fileName} className={styles.attachmentLink}>
                        <span className={styles.fileName}>{file.fileName}</span>
                        <span className={styles.fileSize}>({formatFileSize(file.fileSize)})</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnEdit} onClick={handleEdit}>수정하기</button>
          <button className={styles.btnList} onClick={onClose}>목록으로</button>
        </div>
      </div>
    </div>
  );
}

export default NoticeDetailModal;
