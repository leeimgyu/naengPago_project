/**
 * API 서비스
 * @description Backend API 호출 함수 모음
 */

import type {
  UserAddress,
  UserAddressResponse,
  Coordinates,
  GeocodingResponse,
  NearbyStoresResponse,
  NearbyStoresData
} from '../types/api';

// API 기본 URL 설정 (Vite proxy 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 저장된 인증 토큰 가져오기
 * @returns accessToken 또는 sessionToken
 */
function getAuthToken(): string | null {
  return (
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('sessionToken')
  );
}

/**
 * 현재 로그인한 사용자의 주소 조회
 *
 * @returns 사용자 주소 정보 (zipcode, address1, address2, fullAddress)
 * @throws 인증 실패, 네트워크 오류, 서버 오류
 *
 * @example
 * ```typescript
 * const address = await getUserAddress();
 * if (address) {
 *   console.log(address.fullAddress);
 * }
 * ```
 */
export async function getUserAddress(): Promise<UserAddress | null> {
  const token = getAuthToken();

  if (!token) {
    console.error('❌ 인증 토큰이 없습니다. 로그인이 필요합니다.');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/address`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ 주소 조회 실패:', errorData.message || '알 수 없는 오류');
      return null;
    }

    const result: UserAddressResponse = await response.json();
    return result.data;

  } catch (error) {
    console.error('❌ 주소 조회 중 오류 발생:', error);
    return null;
  }
}

/**
 * 주소를 위도/경도 좌표로 변환
 *
 * @param address - 변환할 주소 (예: "서울특별시 강남구 테헤란로 152")
 * @returns 좌표 정보 (latitude, longitude)
 * @throws 네트워크 오류, 서버 오류
 *
 * @example
 * ```typescript
 * const coords = await geocodeAddress("서울특별시 강남구 테헤란로 152");
 * if (coords) {
 *   console.log(`위도: ${coords.latitude}, 경도: ${coords.longitude}`);
 * }
 * ```
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  if (!address || address.trim() === '') {
    console.error('❌ 주소가 비어있습니다.');
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/geocoding?address=${encodeURIComponent(address)}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ 좌표 변환 실패:', errorData.message || '알 수 없는 오류');
      return null;
    }

    const result: GeocodingResponse = await response.json();

    return {
      latitude: result.data.latitude,
      longitude: result.data.longitude,
    };

  } catch (error) {
    console.error('❌ 좌표 변환 중 오류 발생:', error);
    return null;
  }
}

/**
 * 사용자 주소를 조회한 후 좌표로 변환
 *
 * @returns 사용자 주소의 좌표 정보
 *
 * @example
 * ```typescript
 * const coords = await getUserAddressCoordinates();
 * if (coords) {
 *   // 지도에 마커 표시
 *   displayMarker(coords.latitude, coords.longitude);
 * }
 * ```
 */
export async function getUserAddressCoordinates(): Promise<Coordinates | null> {
  try {
    // 1. 사용자 주소 조회
    const userAddress = await getUserAddress();

    if (!userAddress || !userAddress.address1) {
      console.warn('⚠️ 사용자 주소가 없습니다.');
      return null;
    }

    // 2. 주소를 좌표로 변환
    const coordinates = await geocodeAddress(userAddress.address1);

    if (!coordinates) {
      console.warn('⚠️ 주소 좌표 변환에 실패했습니다.');
      return null;
    }

    return coordinates;

  } catch (error) {
    console.error('❌ 사용자 주소 좌표 조회 중 오류 발생:', error);
    return null;
  }
}

/**
 * 주변 식료품점 검색
 *
 * @param lat - 위도
 * @param lng - 경도
 * @param radius - 검색 반경 (미터, 기본값: 1000)
 * @returns 주변 식료품점 목록
 * @throws 네트워크 오류, 서버 오류
 *
 * @example
 * ```typescript
 * const stores = await searchNearbyStores(37.5665, 126.9780, 1000);
 * if (stores) {
 *   stores.forEach(store => {
 *     console.log(`${store.name} - ${store.distance}m`);
 *   });
 * }
 * ```
 */
export async function searchNearbyStores(
  lat: number,
  lng: number,
  radius: number = 1000
): Promise<NearbyStoresData | null> {
  if (!lat || !lng) {
    console.error('❌ 위도와 경도는 필수 입력값입니다.');
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/stores/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ 식료품점 검색 실패:', errorData.message || '알 수 없는 오류');
      return null;
    }

    const result: NearbyStoresResponse = await response.json();
    return result.data;

  } catch (error) {
    console.error('❌ 식료품점 검색 중 오류 발생:', error);
    return null;
  }
}

// 기본 export
export default {
  getUserAddress,
  geocodeAddress,
  getUserAddressCoordinates,
  searchNearbyStores,
};
