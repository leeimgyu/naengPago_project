package com.backend.security;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpRequestResponseHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository; // Added import for SPRING_SECURITY_CONTEXT_KEY
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Reactive SecurityContext를 Servlet SecurityContextHolder로 복원하는 SecurityContextRepository.
 * 하이브리드 Servlet/WebFlux 애플리케이션에서 비동기 작업 후 SecurityContext가 손실되는 문제를 해결합니다.
 */
@Component
public class ReactiveToServletSecurityContextRepository implements SecurityContextRepository {

    @Override
    public SecurityContext loadContext(HttpRequestResponseHolder requestResponseHolder) {
        HttpServletRequest request = requestResponseHolder.getRequest();

        // 1. HttpServletRequest 속성에서 SecurityContext를 가져오려고 시도합니다 (비동기 디스패치용).
        SecurityContext context = (SecurityContext) request.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);

        if (context != null) {
            return context;
        }

        // 2. ReactiveSecurityContextHolder에서 SecurityContext를 가져오려고 시도합니다.
        context = ReactiveSecurityContextHolder.getContext().blockOptional().orElse(null);

        if (context == null) {
            // Reactor Context 및 요청 속성 모두에 없으면 새로운 빈 SecurityContext를 반환합니다.
            return new SecurityContextImpl();
        }
        return context;
    }

    @Override
    public void saveContext(SecurityContext context, HttpServletRequest request, HttpServletResponse response) {
        // Servlet SecurityContextHolder에 저장하는 표준 동작을 수행합니다.
        SecurityContextHolder.setContext(context);
        // 비동기 디스패치 후 SecurityContext를 복원할 수 있도록 요청 속성에도 저장합니다.
        request.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
    }

    @Override
    public boolean containsContext(HttpServletRequest request) {
        // HttpServletRequest 속성 또는 ReactiveSecurityContextHolder에 SecurityContext가 있는지 확인합니다.
        // Servlet SecurityContextHolder를 직접 호출하면 재귀가 발생할 수 있으므로 피합니다.
        return request.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY) != null ||
               ReactiveSecurityContextHolder.getContext().blockOptional().isPresent();
    }
}
