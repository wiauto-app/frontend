import { cn } from "@/lib/utils";
import { Label } from "./label";

export const CheckBoxContainer = ({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-2")}>
      {title ? <Label className="text-sm font-medium text-slate-600">{title}</Label> : null}
      <div className={cn("grid grid-cols-2 gap-2", className)}>{children}</div>
    </div>
  );
};
