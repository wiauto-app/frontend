import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Label } from "./label";
import { PopoverTrigger } from "./popover";

interface InputButtonProps extends React.ComponentProps<typeof Button> {
  label?: string;
  asPopoverTrigger?: boolean;
}

export const InputButton = ({
  label,
  children,
  className,
  asPopoverTrigger = false,
  variant = "outline",
  ...props
}: InputButtonProps) => {
  const triggerClassName = cn(
    "h-9 min-h-9 w-full justify-start rounded-md border border-input bg-transparent p-2 text-foreground/50 hover:bg-muted-foreground/10",
    className,
  );

  return (
    <div className="flex flex-col gap-1">
      {label ? <Label>{label}</Label> : null}
      {asPopoverTrigger ? (
        <PopoverTrigger
          render={<Button variant={variant} className={triggerClassName} />}
          {...props}
        >
          {children}
        </PopoverTrigger>
      ) : (
        <Button variant={variant} className={triggerClassName} {...props}>
          {children}
        </Button>
      )}
    </div>
  );
};
