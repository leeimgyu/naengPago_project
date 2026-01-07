import { getAuthToken } from "../utils/auth";

const API_BASE_URL = "/api";

interface UploadResponse {
    fileUrl: string;
}

/**
 * 파일을 서버에 업로드하고 해당 파일의 URL을 반환합니다.
 * @param file - 업로드할 파일 객체
 * @param subPath - 파일을 저장할 서버의 하위 디렉토리 (예: "recipes")
 * @returns 업로드된 파일의 URL이 포함된 프로미스
 */
export const uploadFile = async (file: File, subPath: string = 'general'): Promise<UploadResponse> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("인증이 필요합니다. 먼저 로그인해주세요.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subPath", subPath);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type' 헤더는 FormData 사용 시 브라우저가 자동으로 설정하므로 명시하지 않습니다.
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "알 수 없는 서버 오류" }));
        throw new Error(errorData.error || "파일 업로드에 실패했습니다.");
    }

    return response.json();
};
