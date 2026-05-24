const BRAND_BLUE = "#0061F2";

type SectionHeadingProps = {
  lead: string;
  highlight: string;
  className?: string;
};

export function SectionHeading({ lead, highlight, className }: SectionHeadingProps) {
  return (
    <h2
      className={`text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem] lg:text-3xl ${className ?? ""}`}
    >
      {lead}{" "}
      <span style={{ color: BRAND_BLUE }}>{highlight}</span>
    </h2>
  );
}
