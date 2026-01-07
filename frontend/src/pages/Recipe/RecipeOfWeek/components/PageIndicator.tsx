import { weeklyRecipes } from '../data';

interface PageIndicatorProps {
  currentWeek: number;
  currentDay: number;
  headerHeight: number;
}

export function PageIndicator({ currentWeek, currentDay, headerHeight }: PageIndicatorProps) {
  return (
    <div
      className="fixed z-20 hidden text-gray-400 lg:block" // lg 이상에서만 block, 그 이하는 hidden
      style={{
        right: "calc(var(--side-padding) + 3rem + 1rem)", // 썸네일 너비(3rem) + 간격(1rem)
        top: `calc(${headerHeight}px + (100vh - ${headerHeight}px) / 2)`,
        transform: "translateY(-50%)",
      }}
    >
      <span className="text-[14px]">
        <span className="text-[#3b6c55]">
          {String(currentDay + 1).padStart(2, "0")}
        </span>{" "}
        /{" "}
        {String(weeklyRecipes[currentWeek]?.days.length || 7).padStart(
          2,
          "0"
        )}
      </span>
    </div>
  );
}
