import { cn } from "@/lib/utils";

interface SectionContainerProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "as"
> {
  as?: "section" | "div";
}

export function SectionContainer({
  children,
  className,
  as: Component = "section",
  id,
  style,
  ...props
}: SectionContainerProps) {
  return (
    <Component
      id={id}
      className={cn("w-full flex flex-col gap-4", className)}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}
