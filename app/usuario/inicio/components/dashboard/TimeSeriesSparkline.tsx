import { buildSparklinePath } from "./dashboard.utils";

type TimeSeriesSparklineProps = {
  values: number[];
  positive?: boolean;
  ariaLabel?: string;
  className?: string;
};

export const TimeSeriesSparkline = ({
  values,
  positive = true,
  ariaLabel = "Tendencia del período",
  className = "",
}: TimeSeriesSparklineProps) => {
  const path = buildSparklinePath(values);
  const strokeClass = positive ? "stroke-blue-500" : "stroke-red-400";

  if (!path) {
    return (
      <div
        className={`w-14 h-7 rounded bg-gray-100 ${className}`}
        role="img"
        aria-label="Sin datos de tendencia"
      />
    );
  }

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
        <path d={path} />
      </svg>
    </div>
  );
};
