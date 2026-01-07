package com.backend.service.impl;

import com.backend.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageServiceImpl() {
        // 기본 업로드 디렉토리 설정
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("파일을 저장할 디렉토리를 생성할 수 없습니다.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subPath) {
        // 파일 이름에서 유효하지 않은 문자 정리
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            // 파일 이름 유효성 검사
            if (originalFileName.contains("..")) {
                throw new RuntimeException("파일 이름에 유효하지 않은 경로 시퀀스가 포함되어 있습니다: " + originalFileName);
            }

            // 고유한 파일 이름 생성
            String fileExtension = "";
            int dotIndex = originalFileName.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFileName.substring(dotIndex);
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // 파일을 저장할 경로 결정 (하위 디렉토리 포함)
            Path targetLocation = this.fileStorageLocation.resolve(subPath);
            Files.createDirectories(targetLocation); // 하위 디렉토리가 없으면 생성
            Path filePath = targetLocation.resolve(uniqueFileName);

            // 파일 저장
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 웹 접근 가능 경로 반환 (URL 형식)
            return "/uploads/" + subPath + "/" + uniqueFileName;

        } catch (IOException ex) {
            throw new RuntimeException(originalFileName + " 파일을 저장할 수 없습니다. 다시 시도해 주세요.", ex);
        }
    }
}
