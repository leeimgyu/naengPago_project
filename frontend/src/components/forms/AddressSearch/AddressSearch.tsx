import React, { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/useToast';
import type { Address } from '../../../types';
import styles from './AddressSearch.module.css';

interface AddressSearchProps {
  onAddressSelect: (address: Address) => void;
  initialAddress?: Address;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          roadAddress: string;
          jibunAddress: string;
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onAddressSelect, initialAddress }) => {
  const [postalCode, setPostalCode] = useState<string>('');
  const [mainAddress, setMainAddress] = useState<string>('');
  const [detailAddress, setDetailAddress] = useState<string>('');
  const { showToast } = useToast();

  // 초기 주소 설정
  useEffect(() => {
    if (initialAddress) {
      setPostalCode(initialAddress.postalCode || '');
      setMainAddress(initialAddress.main || '');
      setDetailAddress(initialAddress.detail || '');
    }
  }, [initialAddress]);

  const handleSearchAddress = () => {
    if (!window.daum || !window.daum.Postcode) {
      showToast('주소 검색 서비스를 불러올 수 없습니다.', 'error');
      return;
    }

    new window.daum.Postcode({
      oncomplete: data => {
        const postal = data.zonecode;
        const main = data.roadAddress || data.jibunAddress;

        setPostalCode(postal);
        setMainAddress(main);

        // 부모 컴포넌트에 주소 전달
        onAddressSelect({
          postalCode: postal,
          main: main,
          detail: detailAddress
        });

        // 상세주소 입력 필드로 포커스
        const detailInput = document.getElementById('address-detail') as HTMLInputElement;
        if (detailInput) {
          detailInput.focus();
        }
      }
    }).open();
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const detail = e.target.value;
    setDetailAddress(detail);

    // 부모 컴포넌트에 주소 전달
    onAddressSelect({
      postalCode,
      main: mainAddress,
      detail
    });
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor="address">주소</label>
      <div className={styles.addressGroup}>
        <div className={styles.addressPostal}>
          <input
            type="text"
            id="postal-code"
            name="postal-code"
            placeholder="우편번호"
            value={postalCode}
            readOnly
          />
          <button
            type="button"
            className={styles.btnAddressSearch}
            onClick={handleSearchAddress}
          >
            주소 검색
          </button>
        </div>
        <input
          type="text"
          id="address-main"
          name="address-main"
          placeholder="기본 주소"
          value={mainAddress}
          readOnly
        />
        <input
          type="text"
          id="address-detail"
          name="address-detail"
          placeholder="상세 주소 (선택)"
          value={detailAddress}
          onChange={handleDetailChange}
        />
      </div>
    </div>
  );
};

export default AddressSearch;
