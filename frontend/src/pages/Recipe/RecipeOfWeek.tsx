// src/pages/Recipe/RecipeOfWeek.tsx
import React from "react";
import { useResponsiveLayout } from "./RecipeOfWeek/hooks/useResponsiveLayout";
import { useRecipeScroll } from "./RecipeOfWeek/hooks/useRecipeScroll";
import { FixedTitle } from "./RecipeOfWeek/components/FixedTitle";
import { WeeklyNav } from "./RecipeOfWeek/components/WeeklyNav";
import { DailyThumbnails } from "./RecipeOfWeek/components/DailyThumbnails";
import { PageIndicator } from "./RecipeOfWeek/components/PageIndicator";
import { ScrollHint } from "./RecipeOfWeek/components/ScrollHint";
import { RecipeContent } from "./RecipeOfWeek/components/RecipeContent";

export function RecipeOfWeek() {
  const { headerHeight, sidePadding, contentPaddingLeft, contentPaddingRight } = useResponsiveLayout();
  const { containerRef, currentWeek, currentDay, handleNavigation } = useRecipeScroll();

  return (
    <div
      className="h-screen w-screen bg-[#e8e6e1] relative overflow-y-hidden"
      style={{ "--side-padding": sidePadding } as React.CSSProperties}
    >
      <FixedTitle headerHeight={headerHeight} />
      <WeeklyNav currentWeek={currentWeek} handleNavigation={handleNavigation} />
      <DailyThumbnails
        currentWeek={currentWeek}
        currentDay={currentDay}
        headerHeight={headerHeight}
        handleNavigation={handleNavigation}
      />
      <PageIndicator
        currentWeek={currentWeek}
        currentDay={currentDay}
        headerHeight={headerHeight}
      />
      <ScrollHint />

      {/* 가로 스크롤 컨테이너 */}
      <div
        ref={containerRef}
        className="flex h-full overflow-x-scroll scroll-smooth no-scrollbar"
      >
        <RecipeContent 
          contentPaddingLeft={contentPaddingLeft}
          contentPaddingRight={contentPaddingRight}
        />
      </div>

    </div>
  );
}