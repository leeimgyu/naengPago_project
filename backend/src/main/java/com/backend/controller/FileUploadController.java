package com.backend.controller;

import com.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService fileStorageService;

    /**
     * 파일 업로드 엔드포인트
     *
     * @param file 업로드할 MultipartFile
     * @param subPath 파일을 저장할 하위 디렉토리 (예: "recipes", "profiles").
     *                지정하지 않으면 "general"에 저장됩니다.
     * @return 업로드된 파일의 접근 URL
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "subPath", defaultValue = "general") String subPath) {
        try {
            log.info("파일 업로드 요청: originalFilename={}, subPath={}", file.getOriginalFilename(), subPath);

            String fileUrl = fileStorageService.storeFile(file, subPath);

            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            log.info("파일 업로드 성공: fileUrl={}", fileUrl);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("파일 업로드 실패: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
