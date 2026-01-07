import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * OAuth 로그인 콜백 페이지
 * Google 로그인 후 백엔드에서 리다이렉트되어 토큰을 받는 페이지
 */
const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // URL 파라미터에서 토큰 정보 가져오기
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const userId = searchParams.get('userId');

      console.log('OAuth 콜백 수신:', { accessToken: accessToken?.substring(0, 10), refreshToken: refreshToken?.substring(0, 10), userId });

      if (accessToken && refreshToken && userId) {
        try {
          // 토큰 저장 (rememberMe는 false로 가정 - sessionStorage 사용)
          sessionStorage.setItem('sessionToken', accessToken);
          sessionStorage.setItem('refreshToken', refreshToken);
          sessionStorage.setItem('userId', userId);

          console.log('✅ OAuth 로그인 성공: 토큰 저장 완료');

          // 사용자 정보 가져오기
          await refreshUser();

          console.log('✅ 사용자 정보 로드 완료');

          // 성공 모달 표시
          setShowSuccessModal(true);

          // 1.5초 후 메인 페이지로 이동
          setTimeout(() => {
            setShowSuccessModal(false);
            navigate('/');
          }, 1500);
        } catch (err) {
          console.error('❌ 사용자 정보 로드 실패:', err);
          setError('사용자 정보를 불러오는데 실패했습니다.');

          // 3초 후 로그인 페이지로 이동
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } else {
        // 토큰이 없으면 에러 처리
        console.error('❌ OAuth 콜백 실패: 토큰 정보 없음');
        setError('로그인에 실패했습니다. 다시 시도해주세요.');

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, refreshUser]);

  return (
    <>
      {/* 로딩 화면 */}
      {!error && !showSuccessModal && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3b6c55',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>로그인 처리 중...</p>
        </div>
      )}

      {/* 에러 표시 */}
      {error && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <p style={{ color: '#d32f2f', fontSize: '16px' }}>{error}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>로그인 페이지로 이동합니다...</p>
        </div>
      )}

      {/* 성공 모달 */}
      <AlertDialog open={showSuccessModal}>
        <AlertDialogContent className="sm:max-w-sm p-4 left-[60%]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#3b6c55]">
              로그인 성공
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Google 계정으로 로그인에 성공하였습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {/* 스피너 애니메이션 CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default OAuthCallback;
