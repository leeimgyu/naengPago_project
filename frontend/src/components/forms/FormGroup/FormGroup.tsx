/**
 * Form Group Component
 * @description 재사용 가능한 폼 필드 그룹
 */

import React, { forwardRef } from 'react';
import type { FormGroupProps } from '../../../types';
import styles from './FormGroup.module.css';

const FormGroup = forwardRef<HTMLInputElement, FormGroupProps>(({
  label,
  name,
  type = 'text',
  value,
  error,
  placeholder,
  required = false,
  children,
  onChange,
  onBlur
}, ref) => {
  const hasError = !!error;

  return (
    <div className={`${styles.formGroup} ${hasError ? styles.error : ''}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <input
        ref={ref}
        type={type}
        id={name}
        name={name}
        value={value as string}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      {children}
      {hasError && (
        <span id={`${name}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

FormGroup.displayName = 'FormGroup';

export default FormGroup;
