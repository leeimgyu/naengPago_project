import styles from './NoticePage.module.css';
import NoticeList from './components/NoticeList/NoticeList';
import NoticeDetailModal from './components/NoticeDetailModal/NoticeDetailModal';
import NoticeSearch from './components/NoticeSearch/NoticeSearch';
import NoticePagination from './components/NoticePagination/NoticePagination';
import NoticeActions from './components/NoticeActions/NoticeActions';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Notice } from '@/types/notice';
import { getNotices, getNoticeById, formatViews, formatDate, isWithinOneDay } from '@/api/noticeApi';

const NOTICES_PER_PAGE = 10;

// 공지사항 데이터를 UI에 맞게 변환하는 헬퍼 함수
interface DisplayNotice extends Omit<Notice, 'views' | 'date'> {
  views: string;
  date: string;
}

const convertNoticeForDisplay = (notice: Notice): DisplayNotice => {
  return {
    ...notice,
    views: formatViews(notice.views),
    date: formatDate(notice.date),
    isNew: isWithinOneDay(notice.createdAt),
  };
};

function NoticePage() {
  const location = useLocation();
  const [searchCategory, setSearchCategory] = useState<'제목' | '내용' | '제목+내용' | '구분'>('제목+내용');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotice, setSelectedNotice] = useState<DisplayNotice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API 연동 상태
  const [notices, setNotices] = useState<DisplayNotice[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 공지사항 목록 로딩
  const loadNotices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getNotices({
        page: currentPage - 1,  // 백엔드는 0-based 페이지 번호 사용
        pageSize: NOTICES_PER_PAGE,
        keyword: searchKeyword || undefined,
        searchType: searchCategory,
      });

      const displayNotices = response.notices.map(convertNoticeForDisplay);
      setNotices(displayNotices);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '공지사항을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('Error loading notices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지, 검색어, 검색 카테고리 변경 시 데이터 로딩
  useEffect(() => {
    loadNotices();
  }, [currentPage, searchKeyword, searchCategory]);

  // 알림창에서 이동한 경우 해당 공지사항 모달 자동 열기
  useEffect(() => {
    const state = location.state as { noticeId?: number } | null;
    if (state?.noticeId) {
      console.log('📢 Opening notice from notification:', state.noticeId);
      // 공지사항 상세 정보 불러오기
      const loadNoticeDetail = async () => {
        try {
          const notice = await getNoticeById(state.noticeId);
          const displayNotice = convertNoticeForDisplay(notice);
          setSelectedNotice(displayNotice);
          setIsModalOpen(true);
        } catch (err) {
          console.error('Error loading notice detail:', err);
        }
      };
      loadNoticeDetail();
    }
  }, [location.state]);

  const pinnedNotices = notices.filter(notice => notice.isPinned);
  const regularNotices = notices.filter(notice => !notice.isPinned);

  const handleNoticeClick = (notice: DisplayNotice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  return (
    <div className={styles.mainContainer}>


      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>공지사항</h1>
        <p className={styles.pageDescription}>naengpago의 새로운 소식과 중요한 안내사항을 확인하세요</p>
      </div>

      <div className="flex items-center w-full gap-0">
        <NoticeSearch
          totalCount={notices.length}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
        <div className="-ml-3">
          <NoticeActions />
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">공지사항을 불러오는 중...</div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && !isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      {/* 공지사항 목록 */}
      {!isLoading && !error && (
        <>
          <NoticeList
            pinnedNotices={pinnedNotices}
            regularNotices={regularNotices}
            onNoticeClick={handleNoticeClick}
          />

          <NoticePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <NoticeDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        notice={selectedNotice}
      />
    </div>
  );
}

export default NoticePage;
