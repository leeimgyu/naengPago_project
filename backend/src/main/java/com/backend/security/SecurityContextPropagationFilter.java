package com.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Optional;

/**
 * Spring Security Context를 Reactor Context로 전파하는 Servlet Filter.
 * Servlet 환경에서 비동기 작업 시 SecurityContext가 손실되는 문제를 해결하고,
 * 비동기 작업 완료 후 Servlet 스레드로 돌아올 때 SecurityContext를 복원합니다.
 */
@Slf4j
@Component
public class SecurityContextPropagationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        SecurityContext initialSecurityContext = SecurityContextHolder.getContext();

        // 현재 Servlet ThreadLocal의 SecurityContext를 캡처하여
        // Reactor Context로 전파할 준비를 합니다.
        // filterChain.doFilter가 실행될 때, 이 Reactor Context가
        // 다운스트림의 Reactive 작업에서 활용될 것입니다.
        Optional<SecurityContext> securityContextOptional = Optional.ofNullable(initialSecurityContext)
                .filter(context -> context.getAuthentication() != null);

        if (securityContextOptional.isPresent()) {
            log.debug("Reactor Context에 SecurityContext 전파 준비: {}", securityContextOptional.get().getAuthentication().getName());
            // Mono.empty().contextWrite()를 사용하여 Reactor Context에 SecurityContext를 주입합니다.
            // 이 Mono는 실제 필터 체인 작업을 감싸지 않고, 단순히 컨텍스트 전파 로직을 실행합니다.
            Mono.empty()
                .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(securityContextOptional.get())))
                .block(); // 블로킹하여 컨텍스트 주입이 완료되도록 기다립니다.
        } else {
            log.debug("인증 정보 없음. Reactor Context에 SecurityContext 전파 건너김.");
            // ReactiveSecurityContextHolder.clearContext()는 ReactiveToServletSecurityContextRepository에서 처리되거나
            // ReactiveSecurityContextHolder의 기본 동작에 의해 처리됩니다.
        }

        // 실제 필터 체인을 계속 진행합니다.
        // WebAsyncManagerIntegrationFilter가 Servlet 비동기 스레드에서
        // SecurityContext 복원을 처리할 것입니다.
        filterChain.doFilter(request, response);
    }
}