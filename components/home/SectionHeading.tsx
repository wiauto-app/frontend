const BRAND_BLUE = "#0061F2";

type SectionHeadingProps = {
  lead: string;
  highlight: string;
  className?: string;
};

export function SectionHeading({
  lead,
  highlight,
  className,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2
        className={`text-center text-xl sm:text-[1.75rem] lg:text-2xl font-bold tracking-tight text-slate-900  ${className ?? ""}`}
      >
        {lead} <span style={{ color: BRAND_BLUE }}>{highlight}</span>
      </h2>
    </div>
  );
}
