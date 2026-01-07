/**
 * Service Banner Component
 * @description 스크롤 기반 서비스 배너 섹션
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import ServicePanel from "./ServicePanel";
import type { ServicePanel as ServicePanelType } from "@/types";
import styles from "./ServiceBanner.module.css";
import serviceSlide1 from "@/assets/image/service-slide/service_slide_1.jpg";
import serviceSlide2 from "@/assets/image/service-slide/service_slide_2.jpg";
import serviceSlide3 from "@/assets/image/service-slide/service_slide_3.jpg";
import fridgeIcon from "@/assets/image/icon/fridge.png";
import cookingIcon from "@/assets/image/icon/cooking.png";
import locationIcon from "@/assets/image/icon/location.png";

const servicePanels: ServicePanelType[] = [
  {
    image: serviceSlide1,
    titleTop: "냉장고 속 잠자는 식재료부터,",
    titleBottom: "지속가능한 식탁을 위한 제로 웨이스트까지",
    taglineTop: "Cook. Save.",
    taglineBottom: "The Smartest Way to Clear Your Fridge.",
    icon: fridgeIcon,
    iconAlt: "fridge icon",
  },
  {
    image: serviceSlide2,
    titleTop: "식재료 관리,",
    titleBottom: "더 스마트하고 신선하게 시작하세요.",
    taglineTop: "Track. Fresh.",
    taglineBottom: "Keep Your Ingredients at Their Best.",
    icon: cookingIcon,
    iconAlt: "recipe icon",
  },
  {
    image: serviceSlide3,
    titleTop: "제로 웨이스트,",
    titleBottom: "지구를 위한 작은 실천, 주방에서부터.",
    taglineTop: "Reduce. Reuse.",
    taglineBottom: "Sustainable Cooking for a Better Planet.",
    icon: locationIcon,
    iconAlt: "location icon",
  },
];

const ServiceBanner: React.FC = () => {
  // 현재 활성화된 서비스 패널의 인덱스를 관리하는 상태
  const [currentPanel, setCurrentPanel] = useState<number>(0);
  // serviceBannerSection DOM 요소에 직접 접근하기 위한 ref
  const serviceBannerSectionRef = useRef<HTMLDivElement>(null);

  // 화면 크기 변경에 따라 serviceBannerSection의 높이를 동적으로 조절하는 함수
  const handleResize = useCallback(() => {
    if (serviceBannerSectionRef.current) {
      // 화면 너비가 1024px 미만일 경우
      if (window.innerWidth < 1024) {
        // 현재 활성화된 배너 이미지 요소를 찾아 높이를 측정
        const activeBanner = serviceBannerSectionRef.current.querySelector(
          `.${styles.serviceSlideItem}.${styles.active} .${styles.serviceBanner}`
        ) as HTMLElement;

        if (activeBanner) {
          const bannerHeight = activeBanner.offsetHeight; // 배너 이미지의 실제 높이
          // serviceBannerSection의 높이를 배너 이미지 높이의 3배로 설정
          serviceBannerSectionRef.current.style.height = `${
            bannerHeight * 3
          }px`;
        }
      } else {
        // 화면 너비가 1024px 이상일 경우, 동적으로 설정된 높이 제거 (CSS 파일의 높이 적용)
        serviceBannerSectionRef.current.style.height = "";
      }
    }
  }, []);

  // 화면 크기 조절 이벤트 리스너를 등록 및 해제하는 useEffect 훅
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // 컴포넌트 마운트 시 초기 높이 설정

    return () => window.removeEventListener("resize", handleResize); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, [handleResize, currentPanel]); // currentPanel 변경 시에도 높이 재계산

  // 스크롤 이벤트에 따라 현재 활성화된 패널을 변경하는 함수
  const handleScroll = useCallback(() => {
    const section = serviceBannerSectionRef.current; // ref를 사용하여 섹션 DOM 요소 참조
    if (!section) return;

    const scrollTop = window.scrollY; // 현재 스크롤 위치
    const sectionTop = section.getBoundingClientRect().top + window.scrollY; // 섹션의 절대 상단 위치
    const vh = window.innerHeight; // 뷰포트 높이
    const sectionHeight = section.clientHeight; // 섹션의 실제 높이

    // 섹션이 화면 상단에 도달하기 전 스크롤 위치 처리
    if (scrollTop < sectionTop) {
      if (currentPanel !== 0) {
        setCurrentPanel(0); // 첫 번째 패널 활성화
      }
      return;
    }

    // 섹션의 끝을 넘어선 스크롤 위치 처리
    if (scrollTop > sectionTop + sectionHeight - vh) {
      if (currentPanel !== servicePanels.length - 1) {
        setCurrentPanel(servicePanels.length - 1); // 마지막 패널 활성화
      }
      return;
    }

    // 섹션 내부에서의 스크롤 위치에 따라 패널 변경
    const scrollInSection = scrollTop - sectionTop; // 섹션 내 스크롤 위치
    const newIndex = Math.floor(scrollInSection / vh); // 스크롤 위치에 따른 새 패널 인덱스 계산
    const clampedIndex = Math.max(
      0,
      Math.min(newIndex, servicePanels.length - 1)
    ); // 인덱스 범위 제한

    if (clampedIndex !== currentPanel) {
      setCurrentPanel(clampedIndex); // 현재 패널 업데이트
    }
  }, [currentPanel]); // currentPanel 변경 시 handleScroll 함수 재생성

  // 스크롤 이벤트 리스너를 등록 및 해제하는 useEffect 훅
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 컴포넌트 마운트 시 초기 스크롤 위치에 따른 패널 설정

    return () => window.removeEventListener("scroll", handleScroll); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, [handleScroll]); // handleScroll 변경 시 useEffect 재실행

  // 아이콘 클릭 시 해당 패널로 스크롤 이동하는 함수
  const handleIconClick = (index: number) => {
    const section = serviceBannerSectionRef.current; // ref를 사용하여 섹션 DOM 요소 참조
    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY; // 섹션의 절대 상단 위치
    const vh = window.innerHeight; // 뷰포트 높이
    // 클릭된 패널의 위치로 스크롤 이동 (부드러운 스크롤 효과 적용)
    const scrollTarget = sectionTop + index * vh + 1; // 1px 추가하여 정확한 위치로 이동

    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  };

  return (
    // 서비스 배너 섹션 렌더링 (ref를 연결하여 DOM 요소에 접근)
    <section
      className={styles.serviceBannerSection}
      ref={serviceBannerSectionRef}
    >
      <div className={styles.serviceBannerStickyWrapper}>
        {/* 서비스 패널들을 맵핑하여 렌더링 */}
        {servicePanels.map((panel, index) => (
          <ServicePanel
            key={index}
            {...panel}
            isActive={index === currentPanel} // 현재 패널인지 여부 전달
          />
        ))}

        {/* 오버레이 아이콘 그룹 렌더링 */}
        <div className={styles.overlayIconGroup}>
          {servicePanels.map((panel, index) => (
            // 각 아이콘을 나타내는 원형 버튼 렌더링
            <div
              key={index}
              className={`${styles.pointCircle} ${
                index === currentPanel ? styles.active : "" // 현재 패널에 따라 active 클래스 추가
              }`}
              data-index={index}
              onClick={() => handleIconClick(index)} // 클릭 시 해당 패널로 스크롤 이동
              role="button"
              tabIndex={0}
              aria-label={`${index + 1}번째 패널로 이동`}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleIconClick(index);
                }
              }}
            >
              <img src={panel.icon} alt={panel.iconAlt} />{" "}
              {/* 아이콘 이미지 렌더링 */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBanner;
