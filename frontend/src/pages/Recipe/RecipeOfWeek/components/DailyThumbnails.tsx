import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { weeklyRecipes } from '../data';

interface DailyThumbnailsProps {
  currentWeek: number;
  currentDay: number;
  headerHeight: number;
  handleNavigation: (scrollTarget: number) => void;
}

export function DailyThumbnails({ currentWeek, currentDay, headerHeight, handleNavigation }: DailyThumbnailsProps) {
  return (
    <div
      className="fixed z-20 flex-col hidden gap-3 lg:flex" // lg 이상에서만 flex, 그 이하는 hidden
      style={{
        right: "var(--side-padding)",
        top: `calc(${headerHeight}px + (100vh - ${headerHeight}px) / 2)`,
        transform: "translateY(-50%)",
      }}
    >
      {weeklyRecipes[currentWeek]?.days.map((day, index) => (
        <button
          key={index}
          onClick={() => {
            const scrollTarget =
              currentWeek * window.innerWidth * 7 + index * window.innerWidth;
            handleNavigation(scrollTarget);
          }}
          className={`w-12 h-16 rounded overflow-hidden transition-all ${
            currentDay === index
              ? "ring-2 ring-[#3b6c55] opacity-100 scale-110"
              : "opacity-60 hover:opacity-80"
          }`}
        >
          <ImageWithFallback
            src={day.image}
            alt={day.title}
            className="object-cover w-full h-full"
          />
        </button>
      ))}
    </div>
  );
}
