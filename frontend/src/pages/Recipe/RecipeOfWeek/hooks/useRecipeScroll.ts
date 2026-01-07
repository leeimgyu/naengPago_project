// src/pages/Recipe/RecipeOfWeek/hooks/useRecipeScroll.ts
import { useState, useEffect, useRef } from 'react';
import { weeklyRecipes } from '../data';

export function useRecipeScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);

  const handleNavigation = (scrollTarget: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: scrollTarget,
          behavior: "auto",
        });
      }

      setTimeout(() => setIsTransitioning(false), 300);
    }, 300);
  };

  // 스크롤 이벤트를 가로 이동으로 변환
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isWheeling) return;

      const container = containerRef.current;
      if (!container) return;

      const windowWidth = window.innerWidth;
      const totalDays = weeklyRecipes.flatMap((w) => w.days).length;
      const currentDayIndex = Math.round(container.scrollLeft / windowWidth);

      let nextDayIndex = currentDayIndex;

      if (e.deltaY > 0) {
        // Scrolling down/right
        nextDayIndex = Math.min(currentDayIndex + 1, totalDays - 1);
      } else {
        // Scrolling up/left
        nextDayIndex = Math.max(currentDayIndex - 1, 0);
      }

      if (nextDayIndex !== currentDayIndex) {
        setIsWheeling(true);
        container.scrollTo({
          left: nextDayIndex * windowWidth,
          behavior: "smooth",
        });
        setTimeout(() => {
          setIsWheeling(false);
        }, 1200); // Animation duration
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isWheeling]);

  // 현재 위치 추적
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollLeft = containerRef.current.scrollLeft;
        const windowWidth = window.innerWidth;

        // 현재 주차 계산
        const weekIndex = Math.floor(scrollLeft / (windowWidth * 7));
        setCurrentWeek(Math.min(weekIndex, weeklyRecipes.length - 1));

        // 현재 요일 계산
        const dayIndex = Math.floor(
          (scrollLeft % (windowWidth * 7)) / windowWidth
        );
        setCurrentDay(dayIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return {
    containerRef,
    currentWeek,
    currentDay,
    handleNavigation,
  };
}
