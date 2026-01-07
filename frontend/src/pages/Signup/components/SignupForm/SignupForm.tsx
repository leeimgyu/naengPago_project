/**
 * Signup Form Component
 * @description 회원가입 폼
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useForm } from '@/hooks/useForm';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateNickname,
  validatePhone,
} from '@/utils/validation';
import FormGroup from '@/components/forms/FormGroup/FormGroup';
import AddressSearch from '@/components/forms/AddressSearch/AddressSearch';
import type { SignupData, FormErrors, Address } from '@/types';
import styles from './SignupForm.module.css';

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  // OAuth 정보 저장 (hidden fields)
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);
  const [oauthProviderId, setOauthProviderId] = useState<string | null>(null);
  const [isOAuthSignup, setIsOAuthSignup] = useState<boolean>(false);

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm<SignupData>({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      nickname: '',
      phone: '',
      address: undefined,
      termsService: false,
      termsPrivacy: false,
      termsMarketing: false
    },
    validate: (values): FormErrors => {
      const errors: FormErrors = {};

      // 이메일 검증
      if (!values.email) {
        errors.email = '이메일을 입력해주세요';
      } else if (!validateEmail(values.email)) {
        errors.email = '올바른 이메일 형식을 입력해주세요';
      }

      // 비밀번호 검증
      if (!values.password) {
        errors.password = '비밀번호를 입력해주세요';
      } else if (!validatePassword(values.password)) {
        errors.password = '8자 이상, 영문/숫자를 포함해야 합니다';
      }

      // 비밀번호 확인 검증
      if (!values.passwordConfirm) {
        errors.passwordConfirm = '비밀번호 확인을 입력해주세요';
      } else if (values.password !== values.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다';
      }

      // 이름 검증
      if (!values.name) {
        errors.name = '이름을 입력해주세요';
      } else if (!validateName(values.name)) {
        errors.name = '이름은 2-20자의 한글 또는 영문이어야 합니다';
      }

      // 닉네임 검증
      if (!values.nickname) {
        errors.nickname = '닉네임을 입력해주세요';
      } else if (!validateNickname(values.nickname)) {
        errors.nickname = '닉네임은 3-15자의 한글, 영문, 숫자 조합이어야 합니다';
      }

      // 전화번호 검증 (선택사항)
      if (values.phone && !validatePhone(values.phone)) {
        errors.phone = '올바른 전화번호 형식을 입력해주세요 (예: 01012345678)';
      }

      // 약관 동의 검증
      if (!values.termsService) {
        errors.termsService = '서비스 이용약관에 동의해주세요';
      }

      if (!values.termsPrivacy) {
        errors.termsPrivacy = '개인정보처리방침에 동의해주세요';
      }

      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        // OAuth 회원가입인 경우 provider, providerId 추가
        const signupData = isOAuthSignup ? {
          ...values,
          provider: oauthProvider,
          providerId: oauthProviderId
        } : values;

        console.log('=== 회원가입 데이터 전송 ===');
        console.log('isOAuthSignup:', isOAuthSignup);
        console.log('oauthProvider:', oauthProvider);
        console.log('oauthProviderId:', oauthProviderId);
        console.log('signupData:', signupData);

        await signup(signupData as SignupData);
        showToast('회원가입이 완료되었습니다!', 'success');
        onSuccess();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다';
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  });

  // URL 파라미터로 받은 OAuth 정보 처리
  useEffect(() => {
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const provider = searchParams.get('provider');
    const providerId = searchParams.get('providerId');

    if (email && provider && providerId) {
      console.log('OAuth 회원가입 정보 감지:', { email, name, provider, providerId });

      // OAuth 정보 저장
      setOauthProvider(provider);
      setOauthProviderId(providerId);
      setIsOAuthSignup(true);

      // 이메일 자동 입력 (읽기 전용으로 만들기)
      setFieldValue('email', email);

      // 이름이 있으면 자동 입력
      if (name) {
        setFieldValue('name', name);
      }

      showToast(`Google 계정으로 회원가입을 진행합니다.`, 'info');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleAddressSelect = (address: Address) => {
    setFieldValue('address', address);
  };

  const handleTermsAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFieldValue('termsService', checked);
    setFieldValue('termsPrivacy', checked);
    setFieldValue('termsMarketing', checked);
  };

  const termsAllChecked =
    values.termsService && values.termsPrivacy && values.termsMarketing;

  return (
    <form
      id="signup-form"
      className={styles.signupForm}
      aria-label="회원가입 폼"
      noValidate
      onSubmit={handleSubmit}
    >
      {/* 이메일 */}
      <FormGroup
        label="이메일"
        name="email"
        type="email"
        value={values.email}
        error={errors.email}
        placeholder="example@email.com"
        required
        onChange={handleChange}
        disabled={isOAuthSignup}
      />
      {isOAuthSignup && (
        <p style={{ fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '15px' }}>
          Google 계정의 이메일이 자동으로 입력되었습니다.
        </p>
      )}

      {/* 비밀번호 */}
      <FormGroup
        label="비밀번호"
        name="password"
        type="password"
        value={values.password}
        error={errors.password}
        placeholder="비밀번호 입력"
        required
        onChange={handleChange}
      >
        <div className={styles.passwordRequirements}>
          <small>8자 이상, 영문/숫자 포함</small>
        </div>
      </FormGroup>

      {/* 비밀번호 확인 */}
      <FormGroup
        label="비밀번호 확인"
        name="passwordConfirm"
        type="password"
        value={values.passwordConfirm}
        error={errors.passwordConfirm}
        placeholder="비밀번호 재입력"
        required
        onChange={handleChange}
      />

      {/* 이름 */}
      <FormGroup
        label="이름"
        name="name"
        type="text"
        value={values.name}
        error={errors.name}
        placeholder="예 : 홍길동"
        required
        onChange={handleChange}
      />

      {/* 닉네임 */}
      <FormGroup
        label="닉네임"
        name="nickname"
        type="text"
        value={values.nickname}
        error={errors.nickname}
        placeholder="예 : 요리왕냉파고"
        required
        onChange={handleChange}
      >
        <div className={styles.inputHint}>
          <small>3-15자의 한글, 영문, 숫자 조합 (특수문자 불가)</small>
        </div>
      </FormGroup>

      {/* 전화번호 */}
      <FormGroup
        label="전화번호"
        name="phone"
        type="tel"
        value={values.phone || ''}
        error={errors.phone}
        placeholder="01012345678"
        onChange={handleChange}
      />

      {/* 주소 */}
      <AddressSearch onAddressSelect={handleAddressSelect} />

      {/* 약관 동의 */}
      <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
        <label className={`${styles.checkboxLabel} ${styles.checkboxAll}`}>
          <input
            type="checkbox"
            checked={termsAllChecked}
            onChange={handleTermsAllChange}
          />
          <span className={styles.checkboxText}>전체 약관에 동의합니다</span>
        </label>

        <div className={styles.termsDetail}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="termsService"
              checked={values.termsService as boolean}
              onChange={handleChange}
            />
            <span className={styles.checkboxText}>
              서비스 이용약관 동의 <span className={styles.required}>(필수)</span>
            </span>
            <a href="/terms/service.html" target="_blank" className={styles.termsLink}>
              보기
            </a>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="termsPrivacy"
              checked={values.termsPrivacy as boolean}
              onChange={handleChange}
            />
            <span className={styles.checkboxText}>
              개인정보처리방침 동의 <span className={styles.required}>(필수)</span>
            </span>
            <a href="/terms/privacy.html" target="_blank" className={styles.termsLink}>
              보기
            </a>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="termsMarketing"
              checked={values.termsMarketing as boolean}
              onChange={handleChange}
            />
            <span className={styles.checkboxText}>마케팅 정보 수신 동의 (선택)</span>
          </label>
        </div>
      </div>

      {/* 제출 버튼 */}
      <button type="submit" className={styles.btnSignup} disabled={isLoading}>
        {isLoading ? (
          <>
            <span className={styles.spinner}></span>
            <span className={styles.btnLoading}>처리 중...</span>
          </>
        ) : (
          <span className={styles.btnText}>가입하기</span>
        )}
      </button>
    </form>
  );
};

export default SignupForm;
