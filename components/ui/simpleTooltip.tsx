import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface SimpleTooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export const SimpleTooltip = ({
  children,
  content,
  side = "top",
}: SimpleTooltipProps) => {
  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <span
              className="inline-flex max-w-full cursor-default outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              tabIndex={0}
            />
          }
        >
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs text-center leading-snug">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
