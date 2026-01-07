/**
 * Video Slider Component
 * @description 메인 페이지 비디오 슬라이더
 */

import React, { useState, useEffect, useRef } from "react";
import type { VideoSlide } from "@/types";
import styles from "./VideoSlider.module.css";
import fridgeVideo from "@/assets/image/video/fridge.mp4";
import pastaCookVideo from "@/assets/image/video/pasta-cook.mp4";
import fridgeCookVideo from "@/assets/image/video/fridge-cook.mp4";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";

const videoData: VideoSlide[] = [
  {
    src: fridgeVideo,
    title: "Every meal starts in your fridge.",
    subtitle: "모든 요리는 냉장고에서 시작된다",
    preload: "metadata",
  },
  {
    src: pastaCookVideo,
    title: "From Fridge to Table, for a Healthier Nature.",
    subtitle: "냉장고에서 식탁으로, 더 건강한 자연을 위해",
    preload: "none",
  },
  {
    src: fridgeCookVideo,
    title: "No Need to Buy More, Just Cook Smart.",
    subtitle: "새로 살 필요 없어요, 현명하게 요리하세요",
    preload: "none",
  },
];

export const VideoSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPristine, setIsPristine] = useState<boolean>(true); // 초기 상태 추적
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const sloganSectionRef = useRef<HTMLElement>(null);

  // 로딩 오버레이 및 애니메이션 관리
  useEffect(() => {
    // 지속 스크롤 모드: 초기 로드가 끝난 후
    if (!isPristine) {
      const handleScroll = () => {
        setTimeout(() => { // 상태 변경을 다음 틱으로 지연
          setIsLoading(window.scrollY === 0);
        }, 0);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
    // 초기 로드 모드: 최초 진입 시 한 번만 실행
    else {
      const finishInitialLoading = () => {
        setTimeout(() => { // 상태 변경을 다음 틱으로 지연
          setIsLoading(false);
          setIsPristine(false);
        }, 0);
        window.removeEventListener('scroll', finishInitialLoading);
      };

      const autoHideTimer = setTimeout(finishInitialLoading, 3000);
      window.addEventListener('scroll', finishInitialLoading, { once: true });

      return () => {
        clearTimeout(autoHideTimer);
        window.removeEventListener('scroll', finishInitialLoading);
      };
    }
  }, [isPristine]);

  // 비디오 슬라이드 자동 전환 로직
  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo.play().catch((err) => {
        console.warn("비디오 자동 재생 실패:", err);
      });
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const currentVideo = videoRefs.current[prev];
        const nextIndex = (prev + 1) % videoData.length;
        const nextVideo = videoRefs.current[nextIndex];

        if (currentVideo) {
          currentVideo.pause();
        }

        if (nextVideo) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch((err) => {
            console.warn("비디오 재생 실패:", err);
          });
        }

        return nextIndex;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <section
        ref={sloganSectionRef}
        id="slogan-section"
        className={`${styles.sloganSection} ${!isLoading ? styles.loaded : ''}`}
      >
        <div
          ref={containerRef}
          className={`${styles.videoSliderContainer} ${!isLoading ? styles.expanded : ''}`}
        >
          {videoData.map((video, index) => (
            <div
              key={index}
              className={`${styles.videoSlide} ${
                index === currentSlide ? styles.active : ""
              }`}
            >
              <video
                ref={(el: HTMLVideoElement | null) => {
                  videoRefs.current[index] = el;
                }}
                src={video.src}
                loop
                muted
                autoPlay={index === 0}
                playsInline
                preload={video.preload}
                aria-label={video.title}
              />
            </div>
          ))}
          {/* 텍스트를 비디오 컨테이너 안으로 이동하여 clip-path 애니메이션을 함께 적용 */}
          <div ref={overlayContentRef} className={`${styles.overlayContent} ${!isLoading ? styles.expanded : ''}`}>
            <h2>{videoData[currentSlide].title}</h2>
            <p>{videoData[currentSlide].subtitle}</p>
          </div>
        </div>
      </section>
    </>
  );
};
export default VideoSlider;
