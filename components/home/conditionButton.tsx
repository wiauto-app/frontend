import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const ConditionButton = ({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Button 
      variant="outline"
      className={cn(
        "m-0 border-none text-white bg-muted-foreground/40 hover:bg-white/90 rounded-none rounded-t-lg hover:text-black",
        isActive && "bg-white text-black",
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
