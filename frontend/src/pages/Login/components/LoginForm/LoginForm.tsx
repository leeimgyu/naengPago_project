import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useForm } from "@/hooks/useForm";
import { validateEmail } from "@/utils/validation";
import type { LoginCredentials, FormErrors } from "@/types";
import styles from "./LoginForm.module.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    errorType: "email" | "password" | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    errorType: null,
  });

  const [successModal, setSuccessModal] = useState<boolean>(false);

  // Input refs for focus management
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const { values, errors, handleChange, handleSubmit } =
    useForm<LoginCredentials>({
      initialValues: {
        email: "",
        password: "",
        rememberMe: false,
      },
      validate: (values): FormErrors => {
        const errors: FormErrors = {};

        if (!values.email) {
          errors.email = "이메일을 입력해주세요";
        } else if (!validateEmail(values.email)) {
          errors.email = "올바른 이메일 형식을 입력해주세요";
        }

        if (!values.password) {
          errors.password = "비밀번호를 입력해주세요";
        }

        return errors;
      },
      onSubmit: async (values) => {
        setIsLoading(true);

        try {
          await login(values.email, values.password, values.rememberMe);

          // 성공 모달 표시
          setSuccessModal(true);

          // 1.5초 후 메인페이지로 이동하면서 모달 닫기
          setTimeout(() => {
            setSuccessModal(false);
            navigate("/");
          }, 1500);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "로그인에 실패했습니다";
          const errorStatus = (error as any)?.status;
          const errorCode = (error as any)?.code;
          const errorResponse = (error as any)?.response;

          // 디버깅용: 에러 전체 정보 출력
          console.log("=== LoginForm 에러 정보 ===");
          console.log("에러 메시지:", errorMessage);
          console.log("HTTP 상태:", errorStatus);
          console.log("에러 코드:", errorCode);
          console.log("전체 응답:", errorResponse);
          console.log("========================");

          // 에러 메시지 분석하여 에러 타입 결정
          let errorType: "email" | "password" | null = null;
          let title = "로그인 실패";
          let message = errorMessage;

          const lowerCaseError = errorMessage.toLowerCase();

          // 500 에러이지만 "이메일 또는 비밀번호" 메시지인 경우 로그인 실패로 간주
          if (
            errorStatus === 500 &&
            (lowerCaseError.includes("이메일") ||
              lowerCaseError.includes("비밀번호"))
          ) {
            // 백엔드가 구분하지 않으므로 일단 비밀번호 에러로 간주
            // (사용자가 보통 아이디는 기억하고 비밀번호를 틀리는 경우가 많음)
            errorType = "password";
            title = "로그인 실패";
            message = "이메일 또는 비밀번호가 올바르지 않습니다.";
          }
          // 일반 500 에러
          else if (errorStatus === 500) {
            title = "서버 오류";
            message = "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
            errorType = null;
          }
          // 1순위: HTTP 상태 코드로 판단 (404 = 사용자 없음, 401 = 비밀번호 틀림)
          else if (errorStatus === 404) {
            errorType = "email";
            title = "아이디 오류";
            message = "존재하지 않는 아이디입니다.";
          } else if (errorStatus === 401) {
            errorType = "password";
            title = "비밀번호 오류";
            message = "비밀번호가 틀렸습니다.";
          }
          // 2순위: 에러 코드로 판단
          else if (errorCode && typeof errorCode === "string") {
            const lowerCode = errorCode.toLowerCase();
            if (
              lowerCode.includes("user") ||
              lowerCode.includes("email") ||
              lowerCode.includes("not_found")
            ) {
              errorType = "email";
              title = "아이디 오류";
              message = "존재하지 않는 아이디입니다.";
            } else if (
              lowerCode.includes("password") ||
              lowerCode.includes("credential")
            ) {
              errorType = "password";
              title = "비밀번호 오류";
              message = "비밀번호가 틀렸습니다.";
            }
          }
          // 3순위: 에러 메시지 텍스트로 판단
          else if (
            lowerCaseError.includes("비밀번호") &&
            (lowerCaseError.includes("틀") ||
              lowerCaseError.includes("일치하지") ||
              lowerCaseError.includes("잘못") ||
              lowerCaseError.includes("incorrect"))
          ) {
            errorType = "password";
            title = "비밀번호 오류";
            message = "비밀번호가 틀렸습니다.";
          } else if (
            lowerCaseError.includes("존재하지 않는") ||
            lowerCaseError.includes("사용자를 찾을 수 없") ||
            lowerCaseError.includes("user not found") ||
            lowerCaseError.includes("계정을 찾을 수 없")
          ) {
            errorType = "email";
            title = "아이디 오류";
            message = "존재하지 않는 아이디입니다.";
          } else if (lowerCaseError.includes("password")) {
            errorType = "password";
            title = "비밀번호 오류";
            message = "비밀번호가 틀렸습니다.";
          } else if (
            lowerCaseError.includes("email") ||
            lowerCaseError.includes("아이디")
          ) {
            errorType = "email";
            title = "아이디 오류";
            message = "존재하지 않는 아이디입니다.";
          }

          // 모달 표시
          setErrorModal({
            isOpen: true,
            title,
            message,
            errorType,
          });
        } finally {
          setIsLoading(false);
        }
      },
    });

  // 모달 닫기 및 포커스 핸들러
  const handleModalClose = () => {
    // 모달이 닫히기 전에 errorType을 임시 저장
    const focusTarget = errorModal.errorType;

    setErrorModal({
      isOpen: false,
      title: "",
      message: "",
      errorType: null,
    });

    // 모달 애니메이션이 완전히 끝난 후 포커스 설정 (300ms는 모달 애니메이션 시간)
    setTimeout(() => {
      if (focusTarget === "email" && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (focusTarget === "password" && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }, 350);
  };

  return (
    <>
      <form
        id="login-form"
        className={styles.loginForm}
        aria-label="로그인 폼"
        noValidate
        onSubmit={handleSubmit}
      >
        {/* 이메일 */}
        <div className={styles.formGroup}>
          <label htmlFor="email">
            이메일 <span className={styles.required}>*</span>
          </label>
          <input
            ref={emailInputRef}
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
            autoComplete="email"
            value={values.email as string}
            onChange={handleChange}
          />
          {errors.email && (
            <span id="email-error" className={styles.errorMessage} role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* 비밀번호 */}
        <div className={styles.formGroup}>
          <label htmlFor="password">
            비밀번호 <span className={styles.required}>*</span>
          </label>
          <div className={styles.passwordWrapper}>
            <input
              ref={passwordInputRef}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="비밀번호 입력"
              required
              aria-required="true"
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              autoComplete="current-password"
              value={values.password as string}
              onChange={handleChange}
            />
            <button
              type="button"
              className={styles.btnPasswordToggle}
              aria-label={showPassword ? "비밀번호 숨김" : "비밀번호 표시"}
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg
                className={styles.eyeIcon}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10a4 4 0 110-8 4 4 0 010 8zm0-6a2 2 0 100 4 2 2 0 000-4z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          {errors.password && (
            <span
              id="password-error"
              className={styles.errorMessage}
              role="alert"
            >
              {errors.password}
            </span>
          )}
        </div>

        {/* 로그인 상태 유지 */}
        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              id="remember-me"
              name="rememberMe"
              checked={values.rememberMe as boolean}
              onChange={handleChange}
            />
            <span className={styles.checkboxText}>로그인 상태 유지</span>
          </label>
        </div>

        {/* 제출 버튼 */}
        <button type="submit" className={styles.btnLogin} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              <span className={styles.btnLoading}>로그인 중...</span>
            </>
          ) : (
            <span className={styles.btnText}>로그인</span>
          )}
        </button>
      </form>

      {/* 에러 모달 */}
      <AlertDialog
        open={errorModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleModalClose();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{errorModal.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {errorModal.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 성공 모달 */}
      <AlertDialog open={successModal}>
        <AlertDialogContent className="sm:max-w-sm p-4 left-[60%]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#3b6c55]">
              로그인 성공
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              정상적으로 로그인에 성공하였습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LoginForm;
