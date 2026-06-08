import { cn } from "@/lib/utils";

const BRAND_BLUE = "#0061F2";

type VehiclesListingSectionTitleProps = {
  lead: string;
  highlight?: string;
  className?: string;
};

export const VehiclesListingSectionTitle = ({
  lead,
  highlight,
  className,
}: VehiclesListingSectionTitleProps) => {
  return (
    <h2
      className={cn(
        "text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem] lg:text-3xl",
        className,
      )}
    >
      {lead}
      {highlight ? (
        <>
          {" "}
          <span style={{ color: BRAND_BLUE }}>{highlight}</span>
        </>
      ) : null}
    </h2>
  );
};
