// 인증 토큰 가져오기 헬퍼 함수
export const getAuthToken = (): string | null => {
    return (
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("sessionToken")
    );
};
