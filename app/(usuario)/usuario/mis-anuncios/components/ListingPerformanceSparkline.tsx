type ListingPerformanceSparklineProps = {
  positive?: boolean;
  className?: string;
  ariaLabel?: string;
};

const POSITIVE_PATH = "M0 30 L20 20 L40 25 L60 10 L80 15 L100 0";
const NEGATIVE_PATH = "M0 0 L20 15 L40 10 L60 25 L80 20 L100 30";

export const ListingPerformanceSparkline = ({
  positive = true,
  className = "",
  ariaLabel = "Tendencia de rendimiento",
}: ListingPerformanceSparklineProps) => {
  const strokeClass = positive ? "stroke-blue-500" : "stroke-red-400";

  return (
    <div
      className={`w-14 h-7 flex items-end opacity-70 ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 100 30"
        className={`w-full h-full ${strokeClass}`}
        fill="none"
        strokeWidth="2"
        aria-hidden
      >
        <path d={positive ? POSITIVE_PATH : NEGATIVE_PATH} />
      </svg>
    </div>
  );
};
