package com.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

// Spring Web MVC 설정
// - 업로드된 파일을 정적 리소스로 서빙
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.notice-path:uploads/notices}")
    private String noticeUploadPath;

     // 정적 리소스 핸들러 추가
     // /files/** 경로로 요청이 오면 실제 파일 저장 경로에서 파일을 서빙합니다.
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 기존 공지사항 파일 서빙 핸들러 (유지)
        Path noticeUploadPath = Paths.get(this.noticeUploadPath).toAbsolutePath().normalize();
        String noticeUploadLocation = "file:" + noticeUploadPath.toString() + "/";
        registry.addResourceHandler("/files/**")
                .addResourceLocations(noticeUploadLocation)
                .setCachePeriod(3600); // 1시간 캐시

        // 새로운 업로드 파일 서빙 핸들러 (추가)
        // /uploads/** 패턴 요청을 서버의 'uploads/' 디렉토리와 매핑
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");
    }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // 모든 경로에 대해
        .allowedOrigins("http://localhost:5173", "http://localhost:3000") // 이 출처의 요청을 허용
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메소드
        .allowedHeaders("*") // 모든 헤더 허용
        .allowCredentials(true); // 쿠키 등 자격 증명 허용
  }
}
