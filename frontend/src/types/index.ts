/**
 * Naengpago TypeScript Type Definitions
 * @description 냉파고 애플리케이션의 모든 타입 정의
 */

import type { Notice } from './notice';

// ==================== User & Auth Types ====================

export interface User {
  userId: number;           // 백엔드 userId
  username: string;         // 닉네임 (백엔드 username)
  email: string;
  fullName?: string;        // 이름 (백엔드 fullName)
  phone?: string;
  profileImage?: string;    // 프로필 이미지
  // 호환성을 위한 추가 필드
  id?: string;
  name?: string;
  nickname?: string;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Address {
  postalCode: string;
  main: string;
  detail?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  phone?: string;
  address?: Address;
  termsService: boolean;
  termsPrivacy: boolean;
  termsMarketing?: boolean;
  provider?: string | null;      // OAuth 제공자 (google, kakao, naver)
  providerId?: string | null;    // OAuth 제공자의 사용자 고유 ID
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string | null;          // accessToken (회원가입 시 null 가능)
  refreshToken: string | null;    // refreshToken (회원가입 시 null 가능)
  user: User;
  redirectUrl?: string;
}

// ==================== Form Types ====================

export interface FormField {
  name: string;
  value: string | boolean;
  error?: string;
  touched?: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormValues {
  [key: string]: string | boolean | Address | undefined;
}

export interface ValidationRule {
  pattern: RegExp;
  message: string;
}

// ==================== Component Props Types ====================

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface FormGroupProps {
  label: string;
  name: string;
  type?: string;
  value: string | boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
  children?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onRemove: (id: number) => void;
}

// ==================== Video & Slider Types ====================

export interface VideoSlide {
  src: string;
  title: string;
  subtitle: string;
  preload?: 'auto' | 'metadata' | 'none';
}

export interface ServicePanel {
  image: string;
  titleTop: string;
  titleBottom: string;
  taglineTop: string;
  taglineBottom: string;
  icon: string;
  iconAlt: string;
}

export interface RecipeCard {
  day: string;
  dayColor?: string;
  image: string;
  name: string;
  link?: string;
}

export interface IngredientCard {
  image: string;
  title: string;
  subtitle: string;
}

export interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
}

// Notice 타입은 src/types/notice.ts에서 정의됨
// 하위 호환성을 위해 여기서 re-export
export type {
  Notice,
  NoticeAttachment,
  NoticeCreateRequest,
  NoticeUpdateRequest,
  NoticeListResponse,
  NoticeSearchParams,
  NoticeDeleteResponse,
} from './notice';

// ==================== Hook Types ====================

export interface UseFormOptions<T> {
  initialValues: T;
  validate: (values: T) => FormErrors;
  onSubmit: (values: T) => Promise<void> | void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  touched: { [key: string]: boolean };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
  resetForm: () => void;
}

export interface UseSliderOptions {
  totalSlides: number;
  autoPlay?: boolean;
  interval?: number;
}

export interface UseSliderReturn {
  currentSlide: number;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

export interface UseScrollReturn {
  scrollY: number;
  scrollDirection: 'up' | 'down';
}

// ==================== Context Types ====================

export interface ExpiringItem {
  id: number;
  name: string;
  quantity: string;
  category: string;
  expiryDate: string;
  addedAt: string;
  daysRemaining: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  expiringItems: ExpiringItem[];
  recentNotices: Notice[];
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResponse>;
  logout: () => void;
  signup: (userData: SignupData) => Promise<AuthResponse>;
  refreshUser: () => Promise<void>;
  updateUserData: (userData: any) => void;
  loadExpiringItems: () => Promise<void>;
  loadRecentNotices: () => Promise<void>;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastProps['type'], duration?: number) => number;
  removeToast: (id: number) => void;
  toast: (props: {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
    duration?: number;
  }) => number;
}

// ==================== API Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// ==================== Route Types ====================

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

// ==================== Navigation Types ====================

export interface NavigationItem {
  label: string;
  href: string;
  dropdown?: NavigationDropdownItem[];
}

export interface NavigationDropdownItem {
  label: string;
  href: string;
}

// ==================== Footer Types ====================

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
  ariaLabel: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

// ==================== Utility Types ====================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];
