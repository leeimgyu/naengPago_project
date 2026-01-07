/**
 * API 관련 TypeScript 타입 정의
 * @description Backend API 응답 및 요청 타입
 */

// ==================== 사용자 주소 관련 타입 ====================

/**
 * 사용자 주소 정보
 */
export interface UserAddress {
  zipcode: string | null;
  address1: string | null;
  address2: string | null;
  fullAddress: string | null;
}

/**
 * 사용자 주소 API 응답
 */
export interface UserAddressResponse {
  success: boolean;
  message: string;
  data: UserAddress;
  timestamp: string;
}

// ==================== 좌표 변환 관련 타입 ====================

/**
 * 좌표 정보
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * 주소 좌표 변환 응답 데이터
 */
export interface GeocodingData {
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * 주소 좌표 변환 API 응답
 */
export interface GeocodingResponse {
  success: boolean;
  message: string;
  data: GeocodingData;
  timestamp: string;
}

// ==================== 식료품점 검색 관련 타입 ====================

/**
 * 매장 카테고리 타입
 */
export type StoreCategory = '대형마트' | '편의점';

/**
 * 매장 위치 좌표
 */
export interface StorePosition {
  lat: number;
  lng: number;
}

/**
 * 매장 정보
 */
export interface StoreData {
  id: string;
  name: string;
  category: StoreCategory;
  address: string;
  phone?: string;
  hours?: string;
  distance: number;
  position: StorePosition;
}

/**
 * 주변 식료품점 검색 응답 데이터
 */
export interface NearbyStoresData {
  stores: StoreData[];
  totalCount: number;
}

/**
 * 주변 식료품점 검색 API 응답
 */
export interface NearbyStoresResponse {
  success: boolean;
  message: string;
  data: NearbyStoresData;
  timestamp: string;
}

// ==================== 공통 API 응답 타입 ====================

/**
 * 공통 API 응답 구조
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}

/**
 * API 에러 응답
 */
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  timestamp: string;
}
