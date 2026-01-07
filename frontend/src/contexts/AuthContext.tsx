import { createContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthContextType, User, SignupData, AuthResponse } from "../types";
import { getExpiringItems, type ExpiringItem } from "../api/fridgeApi";
import { getRecentNotices } from "../api/noticeApi";
import type { Notice } from "../types/notice";

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([]);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);

  useEffect(() => {
    // 페이지 로드 시 저장된 세션 복원
    const checkAuth = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("sessionToken");

        if (token) {
          // 저장된 사용자 정보 복원
          const userStr =
            localStorage.getItem("user") || sessionStorage.getItem("user");

          if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
          }

          // TODO: 향후 토큰 검증 API 호출 추가
          // const response = await fetch("/api/auth/me", {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          // const result = await response.json();
          // setUser(result.data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // 오류 발생 시 저장된 데이터 정리
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 유통기한 임박 재료 로드 함수
  const loadExpiringItems = async () => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("sessionToken");

      if (!token) {
        setExpiringItems([]);
        return;
      }

      const items = await getExpiringItems(token);
      setExpiringItems(items);
    } catch (error) {
      console.error("유통기한 임박 재료 로드 실패:", error);
      setExpiringItems([]);
    }
  };

  // 최신 공지사항 로드 함수
  const loadRecentNotices = async () => {
    try {
      // 실제 API 호출
      const notices = await getRecentNotices(5);
      // isNew 필드가 true인 것만 필터링 (7일 이내 공지사항)
      const newNotices = notices.filter(notice => notice.isNew);
      setRecentNotices(newNotices);
    } catch (error) {
      console.error("최신 공지사항 로드 실패:", error);
      setRecentNotices([]);
    }
  };

  // 30분마다 유통기한 데이터와 공지사항 갱신
  useEffect(() => {
    if (!user) {
      setExpiringItems([]);
      setRecentNotices([]);
      return;
    }

    // 최초 로드
    loadExpiringItems();
    loadRecentNotices();

    // 30분마다 갱신
    const interval = setInterval(() => {
      loadExpiringItems();
      loadRecentNotices();
    }, 30 * 60 * 1000); // 30분

    return () => clearInterval(interval);
  }, [user]);

  /**
   * ⭐️ 로그인 함수: 실제 백엔드 API 호출 로직 (완료) ⭐️
   */
  const login = async (
    email: string,
    password: string,
    rememberMe?: boolean
  ): Promise<AuthResponse> => {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(), // 이메일 소문자 변환 및 공백 제거
        password,
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError);
      throw new Error("서버 응답을 처리할 수 없습니다.");
    }

    if (!response.ok) {
      const errorMessage =
        result.message || "로그인 요청 처리 중 서버 오류가 발생했습니다.";

      // 디버깅: 전체 응답 정보 출력
      console.log('=== 로그인 실패 상세 정보 ===');
      console.log('HTTP 상태:', response.status, response.statusText);
      console.log('에러 메시지:', result.message);
      console.log('전체 응답:', result);
      console.log('========================');

      // 에러 객체에 추가 정보 포함
      const error = new Error(errorMessage) as Error & {
        status?: number;
        code?: string;
        response?: any;
      };
      error.status = response.status;
      error.code = result.code || result.errorCode;
      error.response = result;

      throw error;
    }

    // 백엔드 응답: result.data = { accessToken, refreshToken, user }
    const authResponse: AuthResponse = {
      success: result.success,
      message: result.message,
      token: result.data.accessToken, // accessToken
      refreshToken: result.data.refreshToken,
      user: result.data.user, // UserSummaryDTO
    };

    // 사용자 정보를 상태에 저장
    setUser(authResponse.user);

    // 토큰 저장
    if (rememberMe) {
      // 자동 로그인: localStorage에 저장
      if (authResponse.token) localStorage.setItem("accessToken", authResponse.token);
      if (authResponse.refreshToken) localStorage.setItem("refreshToken", authResponse.refreshToken);
      // 사용자 정보도 저장 (새로고침 시 복원용)
      localStorage.setItem("user", JSON.stringify(authResponse.user));
    } else {
      // 일회성 로그인: sessionStorage에 저장
      if (authResponse.token) sessionStorage.setItem("sessionToken", authResponse.token);
      sessionStorage.setItem("user", JSON.stringify(authResponse.user));
    }

    return authResponse;
  };

  // 사용자 정보를 직접 업데이트하는 함수 (API 응답 데이터로 업데이트)
  const updateUserData = (userData: any): void => {
    const updatedUser = {
      userId: userData.userId,
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      nickname: userData.nickname || userData.username,
      phone: userData.phone,
      zipcode: userData.zipcode,
      address1: userData.address1,
      address2: userData.address2,
      profileImage: userData.profileImage,
    };

    setUser(updatedUser);

    // localStorage 또는 sessionStorage 업데이트
    if (localStorage.getItem("accessToken")) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else if (sessionStorage.getItem("sessionToken")) {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // 사용자 정보 새로고침 함수 (서버에서 최신 정보 가져오기)
  const refreshUser = async (): Promise<void> => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("sessionToken");

      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await fetch("/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("프로필 정보를 불러올 수 없습니다.");
      }

      const result = await response.json();
      updateUserData(result.data);
    } catch (error) {
      console.error("사용자 정보 새로고침 오류:", error);
      throw error;
    }
  };

  // 로그아웃 함수: 모든 사용자 데이터 완전 삭제 및 메인 페이지로 이동
  const logout = () => {
    // 1. localStorage의 모든 인증 관련 데이터 완전 삭제
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // 2. sessionStorage의 모든 인증 관련 데이터 완전 삭제
    sessionStorage.removeItem("sessionToken");
    sessionStorage.removeItem("user");

    // 3. React 상태 초기화
    setUser(null);

    // 4. 메인 페이지로 리다이렉트
    navigate('/');
  };

  /**
   * ⭐️⭐️⭐️ 회원가입 함수: 실제 백엔드 API 호출 로직 (최종 수정) ⭐️⭐️⭐️
   */
  const signup = async (userData: SignupData): Promise<AuthResponse> => {
    // 1. 프론트엔드 데이터를 백엔드 DTO 형식으로 변환
    const signupRequest = {
      username: userData.nickname, // 닉네임 → username
      email: userData.email.toLowerCase().trim(), // 이메일 소문자 변환 및 공백 제거
      password: userData.password,
      fullName: userData.name, // 이름 → fullName
      phone: userData.phone || undefined, // 선택 필드
      // ✅ 주소 필드 추가 (Address 타입을 백엔드 DTO 형식으로 변환)
      zipcode: userData.address?.postalCode,
      address1: userData.address?.main,
      address2: userData.address?.detail,
      // ✅ OAuth 필드 추가
      provider: userData.provider || undefined,
      providerId: userData.providerId || undefined,
    };

    // 2. 회원가입 API 호출
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupRequest),
    });

    const result = await response.json();

    // 3. 응답 상태 코드 확인 (백엔드 AuthController는 201 Created를 반환함)
    if (!response.ok) {
      const errorMessage =
        result.message || "회원가입 요청 처리 중 오류가 발생했습니다.";
      throw new Error(errorMessage);
    }

    // 4. 회원가입 성공 응답 처리 (백엔드는 UserSummaryDTO를 반환함)
    const authResponse: AuthResponse = {
      success: result.success,
      message: result.message,
      // 회원가입 성공 응답에는 토큰이 없을 수 있으므로 null 처리
      token: null,
      refreshToken: null,
      user: result.data, // UserSummaryDTO
    };

    // 회원가입 후 자동 로그인을 원한다면 여기에 login 함수를 호출하는 로직을 추가해야 합니다.
    // 현재는 단순 가입만 처리하고, 로그인은 별도로 진행합니다.

    return authResponse;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        expiringItems,
        recentNotices,
        login,
        logout,
        signup,
        refreshUser,
        updateUserData,
        loadExpiringItems,
        loadRecentNotices
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
