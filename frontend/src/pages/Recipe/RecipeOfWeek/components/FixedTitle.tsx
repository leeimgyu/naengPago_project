
interface FixedTitleProps {
  headerHeight: number;
}

export function FixedTitle({ headerHeight }: FixedTitleProps) {
  return (
    <div
      className="fixed z-20 hidden pointer-events-none md:block" // md 이상에서만 block, 그 이하는 hidden
      style={{
        left: "var(--side-padding)",
        top: `calc(${headerHeight}px + (100vh - ${headerHeight}px) / 2)`,
        transform: "translateY(-50%)",
      }}
    >
      <div className="rotate-180 writing-mode-vertical text-orientation-mixed">
        <h1
          className="tracking-wider text-gray-900"
          style={{ writingMode: "vertical-rl" }}
        >
          RECIPE OF WEEK
        </h1>
      </div>
    </div>
  );
}
