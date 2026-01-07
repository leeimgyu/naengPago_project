import { weeklyRecipes } from '../data';

interface WeeklyNavProps {
  currentWeek: number;
  handleNavigation: (scrollTarget: number) => void;
}

export function WeeklyNav({ currentWeek, handleNavigation }: WeeklyNavProps) {
  return (
    <div
      className="fixed z-20 flex items-center gap-6 bottom-8"
      style={{ left: "var(--side-padding)" }}
    >
      <div className="w-8 h-8 rounded-full bg-[#3b6c55] flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      {weeklyRecipes.map((week, index) => (
        <button
          key={week.weekNumber}
          onClick={() => {
            const scrollTarget = index * window.innerWidth * 7;
            handleNavigation(scrollTarget);
          }}
          className={`transition-all ${
            currentWeek === index
              ? "text-[#3b6c55] opacity-100"
              : "text-gray-400 opacity-50 hover:opacity-75"
          }`}
        >
          <span className="text-[18px]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </button>
      ))}
    </div>
  );
}
