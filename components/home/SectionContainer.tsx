import { cn } from "@/lib/utils";

type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
  id?: string;
  style?: React.CSSProperties;
};

export function SectionContainer({
  children,
  className,
  as: Component = "section",
  id,
  style,
}: SectionContainerProps) {
  return (
    <Component id={id} className={cn("w-full", className)} style={style}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </Component>
  );
}
