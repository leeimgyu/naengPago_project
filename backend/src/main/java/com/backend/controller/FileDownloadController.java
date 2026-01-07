package com.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 파일 다운로드 컨트롤러
 *
 * - 첨부파일을 강제 다운로드하도록 Content-Disposition 헤더 설정
 * - /api/files/download/** 경로로 요청 처리
 */
@RestController
@RequestMapping("/api/files")
public class FileDownloadController {

    @Value("${file.upload.notice-path:uploads/notices}")
    private String noticeUploadPath;

    /**
     * 파일 다운로드
     *
     * @param filename 다운로드할 파일명
     * @return 파일 리소스와 함께 Content-Disposition: attachment 헤더
     */
    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            // 절대 경로로 파일 위치 확인
            Path filePath = Paths.get(noticeUploadPath).toAbsolutePath().normalize().resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Content-Disposition: attachment 헤더 설정으로 강제 다운로드
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
