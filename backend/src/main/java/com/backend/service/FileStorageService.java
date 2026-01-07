package com.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * 파일을 저장하고 저장된 파일의 접근 경로를 반환합니다.
     * @param file 저장할 파일
     * @param subPath 파일을 저장할 하위 디렉토리 (예: "recipes", "profiles")
     * @return 웹에서 접근 가능한 파일 경로
     */
    String storeFile(MultipartFile file, String subPath);
}
